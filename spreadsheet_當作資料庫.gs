/**
 * =============================================
 * Google Apps Script 多功能自動化主程式（無 Gemini AI 功能）
 * =============================================
 *
 * 【各方法用途與使用邏輯說明】
 *
 * 1. processAutoFileTasksFromSheet()
 *    - 從「自動化任務清單」Sheet 讀取設定，自動批次處理 Google Drive 檔案並呼叫 Dify API。
 *
 * 2. uploadFileToDify(file, user, apiUrl, apiKey, extension)
 *    - 上傳檔案到 Dify 文件 API，回傳檔案ID。
 *    - 需 Dify API Key。
 *
 * 3. runWorkflowWithDify(uploadedFileId, user, apiUrl, apiKey)
 *    - 以檔案ID呼叫 Dify workflow API 執行任務。
 *    - 需 Dify API Key。
 *
 * 4. storeFileToDriveInFolder(fileUrl, folderName, fileName, folderId)
 *    - 從外部URL下載檔案並儲存到指定 Google Drive 資料夾（可指定 folderId）。
 *
 * 5. doPost(e)
 *    - Webhook 入口，根據 operate_method 分派功能。
 *    - 支援 Dify自動化、檔案儲存等多種操作。
 *
 *
 * 【doPost Request JSON 範例】
 *
 * // 1. Dify 自動化批次處理
 * {
 *   "operate_method": "process_auto_file_tasks"
 * }
 *
 * // 2. 上傳檔案到 Dify
 * {
 *   "operate_method": "upload_file_to_dify",
 *   "data": { "file": <DriveFile物件>, "user": "user_id", "apiUrl": "https://api.dify.ai", "apiKey": "xxx", "extension": "pdf" }
 * }
 *
 * // 3. 執行 Dify workflow
 * {
 *   "operate_method": "run_workflow_with_dify",
 *   "data": { "uploadedFileId": "xxx", "user": "user_id", "apiUrl": "https://api.dify.ai", "apiKey": "xxx" }
 * }
 *
 * // 4. 存檔案到指定Drive資料夾
 * {
 *   "operate_method": "store_file_to_drive",
 *   "data": { "file_url": "https://xxx.pdf", "folder_name": "我的資料夾", "file_name": "test.pdf", "folder_id": "資料夾ID(可選)" }
 * }
 *
 * ※ 依實際需求可擴充更多 operate_method 與 data 欄位
 */

// ==================================
// Google Apps Script 多功能自動化主程式（無 Gemini AI 功能）
// ==================================

/**
 * 從Sheet批次處理Drive檔案並呼叫Dify API
 * Extension 欄位說明：
 *   - 只用於本方法內部，作為 Google Drive 資料夾檔案副檔名過濾條件（如 pdf、docx 等）。
 *   - 只會處理副檔名符合 Extension 欄位的檔案。
 *   - 不會傳遞到 uploadFileToDify 或其他方法，僅本地判斷用。
 */
function processAutoFileTasksFromSheet() {
  var sheetName = "自動化任務清單";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log("找不到指定的工作表，建立新工作表: " + sheetName);
    sheet = ss.insertSheet(sheetName);
  }
  var requiredHeaders = ["GoogleDriveFolderId", "Extension", "DifyAPIBaseURL", "APIKey", "UserId", "Enabled"];
  var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var missingHeaders = requiredHeaders.filter(h => !currentHeaders.includes(h));
  if (missingHeaders.length > 0) {
    sheet.insertColumnsAfter(currentHeaders.length, missingHeaders.length);
    for (var i = 0; i < missingHeaders.length; i++) {
      sheet.getRange(1, currentHeaders.length + 1 + i).setValue(missingHeaders[i]);
    }
  }
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowData = {};
    headers.forEach((key, idx) => rowData[key] = row[idx]);
    var folderId = rowData["GoogleDriveFolderId"];
    // Extension 欄位僅用於本方法內部的副檔名過濾，不會傳遞到其他 function
    // var extension = rowData["Extension"]?.toLowerCase().trim();
    var apiUrl = rowData["DifyAPIBaseURL"];
    var apiKey = rowData["APIKey"];
    var user = rowData["UserId"];
    var enabled = rowData["Enabled"]?.toString().toLowerCase() !== "false";
    if (!enabled) {
      Logger.log(`第 ${i + 1} 列已停用 (Enabled=FALSE)，略過。`);
      continue;
    }
    if (!folderId || /* !extension || */ !apiUrl || !apiKey || !user) {
      Logger.log(`第 ${i + 1} 列缺欄位，略過。`);
      continue;
    }
    try {
      var folder = DriveApp.getFolderById(folderId);
      var files = folder.getFiles();
      var fileProcessed = false;
      while (files.hasNext()) {
        var file = files.next();
        var fileName = file.getName();
        // Extension 欄位只在這裡用來判斷副檔名是否符合要處理的條件
        // if (!fileName.startsWith("已掃描") && fileName.toLowerCase().endsWith("." + extension)) {
        //   ...
        // }
        // 你可依需求自行開啟/關閉副檔名過濾
        Logger.log("處理檔案：" + fileName);
        var uploadedFileId = uploadFileToDify(file, user, apiUrl, apiKey);
        if (uploadedFileId) {
          var workflowSuccess = runWorkflowWithDify(uploadedFileId, user, apiUrl, apiKey);
          if (workflowSuccess) {
            file.setName("已掃描_" + fileName);
            Logger.log("成功處理並重新命名：" + file.getName());
          } else {
            Logger.log("Workflow 失敗：「" + fileName + "」");
          }
        } else {
          Logger.log("上傳失敗：「" + fileName + "」");
        }
        fileProcessed = true;
      }
      if (!fileProcessed) {
        Logger.log(`第 ${i + 1} 列：無符合處理條件的檔案`);
      }
    } catch (e) {
      Logger.log("第 " + (i + 1) + " 列發生錯誤：" + e);
    }
  }
}
/**
 * 上傳檔案到 Dify
 * @param {File} file Google Drive 檔案物件
 * @param {string} user 使用者ID
 * @param {string} apiUrl Dify API base URL
 * @param {string} apiKey Dify API金鑰
 * @param {string} extension 檔案副檔名
 * @returns {string|null} 檔案ID
 */
function uploadFileToDify(file, user, apiUrl, apiKey, extension) {
  try {
    var uploadUrl = apiUrl + "/files/upload";
    var pdfBlob = file.getBlob();
    var type = "document";
    var options = {
      method: "post",
      headers: { Authorization: "Bearer " + apiKey },
      payload: { file: pdfBlob, user: user, type: type },
      muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(uploadUrl, options);
    if (response.getResponseCode() === 201) {
      Logger.log("Dify 檔案上傳成功: " + response.getContentText());
      return JSON.parse(response.getContentText()).id;
    } else {
      Logger.log("Dify 檔案上傳失敗: " + response.getContentText());
      return null;
    }
  } catch (e) {
    Logger.log("Dify 檔案上傳發生錯誤: " + e);
    return null;
  }
}
/**
 * 執行 Dify workflow
 * @param {string} uploadedFileId 檔案ID
 * @param {string} user 使用者ID
 * @param {string} apiUrl Dify API base URL
 * @param {string} apiKey Dify API金鑰
 * @returns {boolean} 是否成功
 */
function runWorkflowWithDify(uploadedFileId, user, apiUrl, apiKey) {
  try {
    var workflowUrl = apiUrl + "/workflows/run";
    var payload = {
      inputs: { user_input_file: { transfer_method: "local_file", upload_file_id: uploadedFileId, type: "document" } },
      response_mode: "blocking",
      user: user
    };
    var options = {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(workflowUrl, options);
    if (response.getResponseCode() === 200) {
      Logger.log("Dify Workflow 執行成功: " + response.getContentText());
      return true;
    } else {
      Logger.log("Dify Workflow 執行失敗: " + response.getContentText());
      return false;
    }
  } catch (e) {
    Logger.log("Dify Workflow 呼叫發生錯誤: " + e);
    return false;
  }
}
/**
 * 存檔案到指定Drive資料夾（可指定folderId）
 * @param {string} fileUrl 檔案下載網址
 * @param {string} folderName 資料夾名稱
 * @param {string} fileName 檔案名稱
 * @param {string} folderId 資料夾ID
 * @returns {TextOutput} JSON結果
 */
function storeFileToDriveInFolder(fileUrl, folderName, fileName, folderId) {
  try {
    var folder = folderId
      ? DriveApp.getFolderById(folderId)
      : (function () {
          var parent = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).getParents().next();
          return parent.getFoldersByName(folderName).hasNext()
            ? parent.getFoldersByName(folderName).next()
            : parent.createFolder(folderName);
        })();
    var response = UrlFetchApp.fetch(fileUrl);
    var blob = response.getBlob();
    if (!fileName) {
      var date = new Date();
      fileName = "downloaded_" + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    }
    if (!fileName.includes(".")) {
      var ext = blob.getContentType().split("/")[1];
      fileName += "." + ext;
    }
    var file = folder.createFile(blob.setName(fileName));
    Logger.log("檔案已儲存: " + file.getUrl());
    return ContentService.createTextOutput(JSON.stringify({ result: "success", file_url: file.getUrl() })).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    Logger.log("檔案儲存失敗: " + e);
    return ContentService.createTextOutput(JSON.stringify({ result: "failure", error: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Webhook 入口，根據 operate_method 分派功能
 * @param {Object} e HTTP POST 請求事件物件
 * @returns {TextOutput} JSON結果
 */
function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    var sheetName = request.sheet_name;
    var operateMethod = request.operate_method;
    var data = request.data;
    var indexColumnName = request.index_column_name; // 主欄位名稱
    var threshold = request.threshold;
    var result;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = null;
    var headers = [];

    // ====== 自動建立工作表與表頭 ======
    function ensureSheetAndHeaders() {
      sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log("找不到指定的工作表，建立新工作表: " + sheetName);
        sheet = ss.insertSheet(sheetName);
        // 以 data 的 key 當作表頭
        var headerRow = Object.keys(data);
        sheet.appendRow(headerRow);
        headers = headerRow;
      } else {
        var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
        headers = headerRange.getValues()[0];
      }
    }

    // 輔助函數：若標題中沒有該欄位則新增
    function ensureHeader(columnName) {
      if (headers.indexOf(columnName) === -1) {
        headers.push(columnName);
        sheet.getRange(1, headers.length).setValue(columnName);
      }
    }
    // 輔助函數：若資料是物件則轉換為 JSON 字串
    function stringifyIfObject(value) {
      if (value !== null && typeof value === "object") {
        return JSON.stringify(value);
      }
      return value;
    }

    switch (operateMethod) {
      case "insert_data":
        ensureSheetAndHeaders();
        // 插入資料，補齊表頭
        for (var key in data) {
          data[key] = stringifyIfObject(data[key]);
          ensureHeader(key);
        }
        var newRow = headers.map(function(header) {
          return (data[header] !== undefined) ? data[header] : "";
        });
        sheet.appendRow(newRow);
        Logger.log("已插入新資料: " + JSON.stringify(newRow));
        result = { status: "success", message: "新增資料成功" };
        break;
      case "read_data":
        ensureSheetAndHeaders();
        // 依主欄位查詢資料
        var allData = sheet.getDataRange().getValues();
        var resultArray = [];
        var searchValue = data[indexColumnName];
        for (var i = 1; i < allData.length; i++) {
          if (allData[i][headers.indexOf(indexColumnName)] == searchValue) {
            var rowData = {};
            headers.forEach(function(header, idx) {
              rowData[header] = allData[i][idx];
            });
            resultArray.push(rowData);
          }
        }
        if (resultArray.length === 0) {
          result = { status: "error", message: "找不到符合條件的資料" };
        } else {
          result = { status: "success", data: resultArray };
        }
        Logger.log("查詢結果: " + JSON.stringify(result));
        break;
      case "update_data":
        ensureSheetAndHeaders();
        // 依主欄位尋找並更新第一筆資料，若找不到則插入新資料（upsert）
        for (var key in data) {
          data[key] = stringifyIfObject(data[key]);
        }
        var searchValue = data[indexColumnName];
        var allData = sheet.getDataRange().getValues();
        var rowIndex = -1;
        for (var i = 1; i < allData.length; i++) {
          var row = allData[i];
          if (row[headers.indexOf(indexColumnName)] == searchValue) {
            rowIndex = i + 1;
            break;
          }
        }
        if (rowIndex === -1) {
          // 找不到則插入新資料
          for (var key in data) {
            ensureHeader(key);
          }
          var newRow = headers.map(function(header) {
            return (data[header] !== undefined) ? data[header] : "";
          });
          sheet.appendRow(newRow);
          Logger.log("update_data 未找到主欄位，已插入新資料: " + JSON.stringify(newRow));
          result = { status: "success", message: "找不到資料已自動新增 (upsert)" };
        } else {
          // 找到則更新
          for (var key in data) {
            var colPos = headers.indexOf(key);
            if (colPos !== -1) {
              sheet.getRange(rowIndex, colPos + 1).setValue(data[key]);
            }
          }
          Logger.log("已更新第" + rowIndex + "列: " + JSON.stringify(data));
          result = { status: "success", message: "更新資料成功" };
        }
        break;
      case "delete_data":
        ensureSheetAndHeaders();
        // 依主欄位尋找並刪除第一筆資料
        var searchValue = data[indexColumnName];
        var allData = sheet.getDataRange().getValues();
        var rowIndex = -1;
        for (var i = 1; i < allData.length; i++) {
          if (allData[i][headers.indexOf(indexColumnName)] == searchValue) {
            rowIndex = i + 1;
            break;
          }
        }
        if (rowIndex === -1) {
          result = { status: "error", message: "找不到符合條件的資料" };
        } else {
          sheet.deleteRow(rowIndex);
          Logger.log("已刪除第" + rowIndex + "列");
          result = { status: "success", message: "刪除資料成功" };
        }
        break;
      case "process_auto_file_tasks":
        processAutoFileTasksFromSheet();
        result = { status: "success", message: "已執行自動化檔案處理" };
        break;
      case "store_file_to_drive":
        var folderName = data.folder_name || SpreadsheetApp.getActiveSpreadsheet().getName();
        var fileName = data.file_name;
        var folderId = data.folder_id;
        return storeFileToDriveInFolder(data.file_url, folderName, fileName, folderId);
      case "upload_file_to_dify":
        var file = data.file;
        var user = data.user;
        var apiUrl = data.apiUrl;
        var apiKey = data.apiKey;
        var extension = data.extension;
        var fileId = uploadFileToDify(file, user, apiUrl, apiKey, extension);
        result = { status: fileId ? "success" : "failure", file_id: fileId };
        break;
      case "run_workflow_with_dify":
        var uploadedFileId = data.uploadedFileId;
        var user = data.user;
        var apiUrl = data.apiUrl;
        var apiKey = data.apiKey;
        var ok = runWorkflowWithDify(uploadedFileId, user, apiUrl, apiKey);
        result = { status: ok ? "success" : "failure" };
        break;
      default:
        result = { status: "error", message: "不支援的操作: " + operateMethod };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("doPost 錯誤: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
