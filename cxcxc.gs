/**
 * 這段程式碼是為雲育鏈職場AI軟體暨雲端應用課程所設計。
 * 課程內容涵蓋了如何使用Google Apps Script來自動化業務流程，
 * 並應用於AI代理人的開發與雲端應用的整合。
 * 
 * 更多課程資訊請參考雲育鏈官網：https://www.cxcxc.io/agentic-ai-course/
 * 
 * 授權條款：如需課程包班合作，可加入Line官方號進行 https://lin.ee/nlPnBYS。
 */

//==================================
// 全域變數與常數設定區
//==================================

// 設定 API 網址參考說明，這裡提供 Gemini API 的相關文件網址
// https://ai.google.dev/gemini-api/docs/api-versions?hl=zh-tw
// https://ai.google.dev/gemini-api/docs/function-calling

// 從環境變數中取得 Google API Key，這樣可以確保密鑰不會硬編碼在程式中
const apiKey = PropertiesService.getScriptProperties().getProperty("GOOGLE_AI_API_KEY")

//==================================
// 模型名稱取得函數
//==================================

/**
 * getModelName
 * 此函數用於獲取目前所設定的 Gemini 模型名稱。
 * 若未設置模型名稱或名稱為空，則預設使用 "gemini-2.0-flash-lite"。
 */
function getModelName() {
  // 從環境變數中取得模型名稱
  var modelName = PropertiesService.getScriptProperties().getProperty("GEMINI_MODEL_NAME");
  
  // 檢查模型名稱是否為空或未定義，若是則給予預設值
  if (modelName === null || modelName === undefined || modelName.trim() === "") {
    modelName = "gemini-2.0-flash-lite";  // 預設模型名稱
  }
  
  return modelName;
}

//==================================
// Gemini QA 文字問答函數
//==================================

/**
 * GeminiQA
 * 透過Google Apps Script呼叫Gemini API，針對單一文字問題進行問答生成。
 * @param {string} question - 使用者的提問文字。
 * @returns {string|null} - API回傳的答案文字；若發生錯誤則回傳 null。
 */
function GeminiQA(question) {
  var modelName = getModelName(); // 取得目前使用的模型名稱
  // 建構API請求的 URL，根據模型名稱及 API key 組合
  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;
  
  // 設定API請求的 payload，將問題包裝在 contents 陣列中
  var payload = {
    "contents": [{
      "parts": [{
        "text": question
      }]
    }]
  };

  // 設定請求選項，包括 HTTP 方法、內容類型以及 JSON 格式的 payload
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    // 發送 HTTP 請求至 Gemini API
    var response = UrlFetchApp.fetch(url, options);
    // 解析 API 回應為 JSON 物件
    var json = JSON.parse(response.getContentText());
    
    // 取出回傳結果中第一個候選答案的文字
    var answer = json.candidates[0].content.parts[0].text;
    
    return answer;
  } catch (error) {
    // 若發生錯誤，將錯誤資訊記錄到 Logger 中，並回傳 null
    Logger.log("Error: " + error.toString());
    return null;
  }
}

//==================================
// Gemini 圖片問答函數
//==================================

/**
 * GeminiQAFromImage
 * 此函數用於處理圖片相關的問答功能，會先下載圖片並轉為Base64格式，
 * 再與問題一起發送給 Gemini API 進行處理。
 * @param {string} question - 使用者的提問文字。
 * @param {string} image_url - 圖片的網址。
 * @returns {string|null} - API回傳的答案文字；若發生錯誤則回傳 null。
 */
function GeminiQAFromImage(question, image_url) {
  // 下載圖片，取得圖片 Blob 資料
  var imageBlob = UrlFetchApp.fetch(image_url).getBlob();

  // 取得圖片的 MIME 類型，例如 image/jpeg、image/png 等
  var mimeType = imageBlob.getContentType();

  // 將圖片 Blob 轉換為 Base64 編碼的字串
  var imageBase64 = Utilities.base64Encode(imageBlob.getBytes());
  
  // 構建 API 請求的數據，包含提問文字與圖片資料（以 inline_data 格式提供）
  var payload = {
    "contents": [
      {
        "parts": [
          {
            "text": question
          },
          {
            "inline_data": {
              "mime_type": mimeType,
              "data": imageBase64
            }
          }
        ]
      }
    ]
  };

  var modelName = getModelName(); // 取得模型名稱
  // 組合 API URL，與文字問答類似，但針對圖片內容也適用
  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

  // 設定請求選項
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    // 發送請求並取得 API 回應
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    // 取出候選答案中的文字結果
    var answer = json.candidates[0].content.parts[0].text;
    
    return answer; // 回傳處理結果
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return null;
  }
}

//==================================
// Gemini 文本分類函數
//==================================

/**
 * GeminiClassify
 * 此函數用於將輸入文本按照指定的分類陣列進行分類。
 * @param {Array} class_array - 分類標籤的陣列，例如 ["新聞", "娛樂", "體育"]。
 * @param {string} content - 需要分類的文本內容。
 * @param {string} [extra_prompt=""] - 額外的提示文字，可進一步影響分類結果。
 * @returns {string} - API回傳的分類結果（去除換行符號）。
 */
function GeminiClassify(class_array, content, extra_prompt="") {
  // 將分類陣列轉換成以逗號分隔的字串
  var classString = class_array.join(", ");

  // 組合分類提示語句，要求 API 直接回覆分類結果
  var prompt = "請將以下內容分類為：" + classString + " 。 直接告訴我分類就好，不需要解釋。"+ extra_prompt +"。 內容：" + content ;

  // 建構 API 請求的 payload
  var payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };

  var modelName = getModelName(); // 取得模型名稱
  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    // 呼叫 Gemini API 並取得回應
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    Logger.log(json);
    // 取出候選分類結果的文字內容
    var classification = json.candidates[0].content.parts[0].text;
    
    // 去除分類結果中的換行符號後回傳
    return classification.replace(/\r?\n|\r/g, '');
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return "Error: " + error.toString();
  }
}

//==================================
// Gemini 向量化函數（文本轉向量）
//==================================

/**
 * GeminiVector001
 * 此函數將輸入的文本轉換成向量表示，便於後續進行文本相似度計算等應用。
 * @param {string} input_value - 要轉換成向量的文本。
 * @returns {string} - 向量數值組成的字串，數值間以逗號隔開；若失敗則回傳錯誤訊息。
 */
function GeminiVector001(input_value) {
  // 構建 API 請求數據，指定使用 embedding 模型來生成向量
  var payload = {
    "model": "models/embedding-001",
    "content": {
      "parts": [{
        "text": input_value
      }]
    }
  };

  var modelName = getModelName(); // 取得模型名稱（雖然 embedding 模型可能獨立）
  // 組合 embedding API 的 URL，此處使用 text-embedding-004 模型
  var url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" + apiKey;

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    // 發送請求並解析回應
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    // 檢查回應中是否有 embedding 資料，並將數值陣列轉為字串回傳
    if (json.embedding && json.embedding.values) {
      var vectorString = json.embedding.values.join(", ");
      return vectorString;
    } else {
      return "Error: Unexpected API response format.";
    }
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return "Error: " + error.toString();
  }
}

//==================================
// 向量相似度計算函數（餘弦相似度）
//==================================

/**
 * GeminiVectorSimilarCalculate
 * 此函數計算兩個向量之間的餘弦相似度，並回傳相似度分數。
 * @param {string} vector1_string - 第一個向量的字串（逗號分隔的數值）。
 * @param {string} vector2_string - 第二個向量的字串（逗號分隔的數值）。
 * @returns {number|string} - 回傳相似度數值；若向量長度不符或有零向量則回傳錯誤訊息。
 */
function GeminiVectorSimilarCalculate(vector1_string, vector2_string) {
  // 將逗號分隔的向量字串轉換為數字陣列
  var vector1 = vector1_string.split(",").map(Number);
  var vector2 = vector2_string.split(",").map(Number);

  // 確認兩個向量長度相同，不同則無法計算相似度
  if (vector1.length !== vector2.length) {
    return "Error: Vectors must have the same length.";
  }

  // 初始化內積及各自向量的平方和
  var dotProduct = 0;
  var magnitude1 = 0;
  var magnitude2 = 0;

  // 遍歷向量，計算內積與向量模
  for (var i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }

  // 取平方根得到向量的實際模長
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  // 若任一向量模為 0，則無法計算相似度
  if (magnitude1 === 0 || magnitude2 === 0) {
    return "Error: One of the vectors has zero magnitude.";
  }

  // 計算餘弦相似度公式
  var similarity = dotProduct / (magnitude1 * magnitude2);
  return similarity; // 回傳相似度結果
}

//==================================
// 從 Google Docs 範本建立 PDF 的函數
//==================================

/**
 * createPDFfromDocTemplate
 * 此函數基於指定的 Google Docs 範本生成 PDF 文件，並可進行內容替換。
 * 若未指定範本檔名、資料夾或 PDF 檔案名稱，則分別使用預設值或自動生成。
 * @param {string} templateDocName - Google Docs 範本名稱，預設為 "文件範本"。
 * @param {string} pdfFileName - 生成的 PDF 檔案名稱（時間戳＋亂碼或使用者指定）。
 * @param {object} replaceMap - 替換對應範本中 {{key}} 標記的字典。
 * @param {string} folderName - 儲存 PDF 的目標資料夾名稱，若未指定則使用範本所在資料夾。
 * @returns {string} - JSON 格式字串，包含生成結果、PDF 連結與訊息。
 */
function createPDFfromDocTemplate(templateDocName, pdfFileName, replaceMap, folderName) {
  try {
    // 若未指定範本名稱，預設為 "文件範本"
    if (!templateDocName) {
      templateDocName = "文件範本";
    }

    // 透過檔案名稱搜尋 Google Drive 上的範本文件
    var files = DriveApp.getFilesByName(templateDocName);
    
    if (!files.hasNext()) {
      return JSON.stringify({
        "result": "failure",
        "message": "範本文件未找到"
      });
    }

    var templateFile = files.next();
    var templateDoc = DocumentApp.openById(templateFile.getId());
    
    // 複製一份範本文件進行修改
    var copiedDoc = templateFile.makeCopy();
    var copiedDocId = copiedDoc.getId();
    var copiedDocFile = DocumentApp.openById(copiedDocId);
    
    // 取得複製文件的內容，並根據 replaceMap 進行多處文字替換
    var body = copiedDocFile.getBody();
    
    for (var key in replaceMap) {
      if (replaceMap.hasOwnProperty(key)) {
        // 將範本中所有 {{key}} 文字替換成 replaceMap 中對應的 value
        body.replaceText("{{"+key+"}}", replaceMap[key]);
      }
    }

    // 儲存並關閉文件，確保替換內容生效
    copiedDocFile.saveAndClose();
    
    // 若未指定目標資料夾名稱，則使用範本文件所在的父資料夾
    var targetFolder;
    if (!folderName) {
      targetFolder = templateFile.getParents().next();
    } else {
      // 根據資料夾名稱搜尋對應的資料夾
      var folders = DriveApp.getFoldersByName(folderName);
      
      if (!folders.hasNext()) {
        return JSON.stringify({
          "result": "failure",
          "message": "指定的資料夾未找到"
        });
      }

      targetFolder = folders.next();
    }

    // 生成當前時間戳 (格式：yyyymmddHHMMss)
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHHmmss");
    
    // 生成隨機碼 (6位亂碼)
    var randomString = Math.random().toString(36).substring(2, 8);
    
    // 若未提供 PDF 檔名，則使用 timestamp 與亂碼命名；若有則附加使用者指定名稱
    if (!pdfFileName) {
      pdfFileName = timestamp + "-" + randomString;
    } else {
      pdfFileName = timestamp + "-" + pdfFileName;
    }
    
    // 將修改後的文件轉為 PDF 格式
    var pdfBlob = DriveApp.getFileById(copiedDocId).getAs('application/pdf');
    
    // 在目標資料夾中創建 PDF 檔案，並以指定檔名儲存
    var pdfFile = targetFolder.createFile(pdfBlob).setName(pdfFileName + '.pdf');
    
    // 設定 PDF 權限為「有連結的人可讀」
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 刪除用於生成 PDF 的臨時複製文件
    DriveApp.getFileById(copiedDocId).setTrashed(true);
    
    // 取得 PDF 文件的網頁連結
    var webLink = pdfFile.getUrl();
    
    // 組合並回傳結果 JSON 字串
    var result = {
      "result": "success",
      "fileName": pdfFileName + '.pdf',
      "fileLink": webLink,
      "message": "PDF 已生成並設為有連結的人可讀"
    };
    
    Logger.log(JSON.stringify(result)); // 輸出日誌方便除錯
    return JSON.stringify(result);

  } catch (error) {
    Logger.log("Error: " + error.message);
    return JSON.stringify({
      "result": "failure",
      "message": "發生錯誤: " + error.message
    });
  }
}

//==================================
// 儲存圖片至 Google Drive 的函數
//==================================

/**
 * storeImageToDrive
 * 此函數下載指定 URL 的圖片並儲存至 Google Drive 中，
 * 若指定的資料夾不存在則自動建立，並回傳圖片檔案的連結。
 * @param {string} imageUrl - 圖片網址。
 * @param {string} folderName - 儲存圖片的資料夾名稱。
 * @returns {ContentService.TextOutput} - 回傳包含儲存結果與圖片連結的 JSON 格式文字輸出。
 */
function storeImageToDrive(imageUrl, folderName) {
  try {
    // 1. 檢查指定名稱的資料夾是否存在，若不存在則建立新資料夾
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // 2. 透過 UrlFetchApp 下載圖片
    var response = UrlFetchApp.fetch(imageUrl);
    var blob = response.getBlob();
    
    // 3. 建立一個唯一檔名，並將圖片儲存到指定資料夾
    var fileName = "downloaded_image_" + new Date().getTime() + ".jpg";
    var file = folder.createFile(blob.setName(fileName));
    
    // 4. 記錄並回傳圖片存放的 URL
    Logger.log("Image saved successfully: " + file.getUrl());
    return ContentService.createTextOutput(JSON.stringify({ result: "success", image_url: file.getUrl() }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ result: "failure", error: "圖片抓取或儲存失敗" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

//==================================
// 入口函數：處理 HTTP POST 請求
//==================================

/**
 * doPost
 * 此函數作為 Webhook 的入口，接收 HTTP POST 請求，
 * 根據傳入的 JSON 內容判斷操作類型，進行 CRUD、PDF生成或其他操作。
 * @param {Object} e - HTTP POST 請求事件物件，包含 postData。
 * @returns {ContentService.TextOutput} - 回傳 JSON 格式的操作結果。
 */
function doPost(e) {
  try {
    // 解析 POST 傳入的 JSON 內容
    var request = JSON.parse(e.postData.contents);
    var sheetName = request.sheet_name;
    var operateMethod = request.operate_method;
    var data = request.data;
    var indexColumnName = request.index_column_name; // 用於 CRUD 操作
    var threshold = request.threshold; // 用於向量查詢時的相似度門檻
    
    // 取得當前活躍試算表與指定分頁
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    // 可針對不需要試算表資料的操作（如 generate_pdf）進行例外處理
    
    // 取得第一列作為標題列，用於後續資料對應
    var headerRange = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()) : null;
    var headers = headerRange ? headerRange.getValues()[0] : [];
    
    // 輔助函數：若標題中沒有該欄位則新增
    function ensureHeader(columnName) {
      if (headers.indexOf(columnName) === -1) {
        headers.push(columnName);
        sheet.getRange(1, headers.length).setValue(columnName);
      }
    }
    
    // 輔助函數：呼叫向量化函數 GeminiVector001
    function vectorize(text) {
      return GeminiVector001(text);
    }
    
    // 輔助函數：若資料是物件則轉換為 JSON 字串，避免存入試算表時格式錯誤
    function stringifyIfObject(value) {
      if (value !== null && typeof value === "object") {
        return JSON.stringify(value);
      }
      return value;
    }
    
    var result;
    // 根據 operate_method 決定要執行的操作
    switch (operateMethod) {
      case "insert_data":
        // 將 data 中所有物件類型轉為字串
        for (var key in data) {
          data[key] = stringifyIfObject(data[key]);
        }
        // 對每個非向量欄位進行向量化處理，並將結果存入對應的 vector_ 欄位
        for (var key in data) {
          if (!key.startsWith("vector_")) {
            var vectorKey = "vector_" + key;
            var textValue = data[key] + "";
            var vectorValue = vectorize(textValue);
            data[vectorKey] = vectorValue;
            ensureHeader(vectorKey);
          }
          ensureHeader(key);
        }
        // 根據標題順序建立新的一列資料
        var newRow = headers.map(function(header) {
          return (data[header] !== undefined) ? data[header] : "";
        });
        sheet.appendRow(newRow);
        result = {status: "success", message: "新增資料成功"};
        break;
      case "normal_insert_data":
        // 只將 data 原始欄位存入試算表，不調用 AI 模型與向量化
        for (var key in data) {
          data[key] = stringifyIfObject(data[key]);
          ensureHeader(key);
        }
        var newRow = headers.map(function(header) {
          return (data[header] !== undefined) ? data[header] : "";
        });
        sheet.appendRow(newRow);
        result = { status: "success", message: "新增資料成功 (normal_insert_data)" };
        break;    
      case "read_data":
        // 將 threshold 轉換為數值型態 (用於向量查詢)
        threshold = parseFloat(threshold);
        var allData = sheet.getDataRange().getValues();
        var resultArray = [];
        // 判斷查詢是否針對向量欄位 (以 "vector_" 為開頭)
        if (indexColumnName.indexOf("vector_") === 0) {
          // 取得對應的原始欄位名稱，例如：vector_columnA_name 對應 columnA_name
          var originalKey = indexColumnName.replace("vector_", "");
          // 使用 data 中原始文字進行向量查詢
          var queryText = data[originalKey];
          if (!queryText) {
            result = {status: "error", message: "請提供查詢的原始文字：" + originalKey};
            break;
          }
          var queryVector = vectorize(queryText + "");
          var vectorColIndex = headers.indexOf(indexColumnName);
          if (vectorColIndex === -1) {
            result = {status: "error", message: "找不到對應的向量欄位：" + indexColumnName};
            break;
          }
          // 遍歷試算表資料，計算相似度
          for (var i = 1; i < allData.length; i++) {
            var row = allData[i];
            var storedVector = row[vectorColIndex] + "";
            var similarity = GeminiVectorSimilarCalculate(queryVector, storedVector);
            // 若相似度大於門檻，則加入結果集合
            if (similarity >= threshold) {
              var rowData = {};
              headers.forEach(function(header, idx) {
                if (!header.startsWith("vector_")) {
                  rowData[header] = row[idx];
                }
              });
              rowData.similarity = similarity;
              resultArray.push(rowData);
            }
          }
        } else {
          // 一般文字查詢：根據指定的 index_column_name 過濾符合條件的資料列
          var searchValue = data[indexColumnName];
          for (var i = 1; i < allData.length; i++) {
            if (allData[i][headers.indexOf(indexColumnName)] == searchValue) {
              var rowData = {};
              headers.forEach(function(header, idx) {
                if (!header.startsWith("vector_")) {
                  rowData[header] = allData[i][idx];
                }
              });
              resultArray.push(rowData);
            }
          }
        }
        // 若沒有找到任何符合條件的資料，則回傳錯誤訊息
        if (resultArray.length === 0) {
          result = {status: "error", message: "找不到符合條件的資料"};
        } else {
          result = {status: "success", data: resultArray};
        }
        break;
        
      case "update_data":
        // 將 data 中所有物件類型轉為字串
        for (var key in data) {
          data[key] = stringifyIfObject(data[key]);
        }
        // 根據 index_column_name 查找需要更新的資料列
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
          result = {status: "error", message: "找不到符合條件的資料"};
        } else {
          // 更新前先針對每個非向量欄位計算新向量值，並更新對應 vector_ 欄位
          for (var key in data) {
            if (!key.startsWith("vector_")) {
              var vectorKey = "vector_" + key;
              var textValue = data[key] + "";
              var vectorValue = vectorize(textValue);
              data[vectorKey] = vectorValue;
              ensureHeader(key);
              ensureHeader(vectorKey);
            }
          }
          // 更新指定的欄位資料
          for (var key in data) {
            var colPos = headers.indexOf(key);
            if (colPos !== -1) {
              sheet.getRange(rowIndex, colPos + 1).setValue(data[key]);
            }
          }
          result = {status: "success", message: "更新資料成功"};
        }
        break;
        
      case "delete_data":
        // 根據 index_column_name 尋找並刪除符合條件的資料列
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
          result = {status: "error", message: "找不到符合條件的資料"};
        } else {
          sheet.deleteRow(rowIndex);
          result = {status: "success", message: "刪除資料成功"};
        }
        break;
        
      case "generate_pdf":
        // 對於生成 PDF 的操作，不需要試算表中的資料
        var templateName = data.template_name;
        var pdfFileName = data.generate_pdf_name;
        var folderName = data.folder_name;
        var replaceMap = data.replace_map;
        // 呼叫 createPDFfromDocTemplate 函數生成 PDF，並直接回傳結果
        var pdfResult = createPDFfromDocTemplate(templateName, pdfFileName, replaceMap, folderName);
        // pdfResult 為 JSON 格式的字串，直接回應給客戶端
        return ContentService.createTextOutput(pdfResult)
          .setMimeType(ContentService.MimeType.JSON);
        
      default:
        // 若操作不在支援範圍內，回傳錯誤訊息
        result = {status: "error", message: "不支援的操作: " + operateMethod};
    }
    
    // 回傳最終的操作結果（JSON 格式）
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 捕捉例外錯誤，並回傳錯誤訊息
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", 
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


// Gemini with Function tool
function GeminiQAWithWeb(user_question) {
  
  var modelName = getModelName(); // 獲取模型名稱
  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;
  
  // user_question="what kind book in there https://www.amazon.co.jp/kindle-dbs/storefront?storeType=browse&node=2275256051"
  // user_question="visit content from https://langchain-ai.github.io/langgraph/tutorials/introduction/#requirements"
  // user_question="你會讀中文嗎?";
  // user_question= "https://langchain-ai.github.io/langgraph/tutorials/introduction/#requirements  Help me look at the code in this website and what is the key point? please use chinese reply"


  Logger.log("發送請求到 Gemini API，問題: " + user_question);

   var payload = {
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": user_question
          }
        ]
      }
    ],
    "tools": [
      {
        "function_declarations": [
{
  "name": "GeminiFetchUrl",
  "description": "Sends an HTTP request to a specified URL with various options for method, headers, and payload, and includes the user's original question.",
  "parameters": {
    "type": "object",
    "properties": {
      "url": {
        "type": "string",
        "description": "The URL to send the request to."
      },
      "user_question": {
        "type": "string",
        "description": "The question intent from the question ."
      },
      "method": {
        "type": "string",
        "description": "The HTTP method to use, e.g., GET, POST, PUT, DELETE.",
        "enum": ["get", "delete", "patch", "post", "put"]
      },
      "headers": {
        "type": "object",
        "description": "Optional HTTP headers to include in the request.",
        "properties": {
          "Content-Type": {
            "type": "string",
            "description": "The MIME type of the body of the request, e.g., application/json."
          },
          "Authorization": {
            "type": "string",
            "description": "Optional authorization token for the request."
          },
          "Custom-Header": {
            "type": "string",
            "description": "A custom header that you may want to add to the request."
          }
        }
      },
      "payload": {
        "type": "string",
        "description": "Optional data to send with the request, typically used for POST or PUT requests. This should be a JSON string, a URL-encoded form data string, or another format depending on the Content-Type."
      },
      "contentType": {
        "type": "string",
        "description": "The content type of the payload, e.g., application/json, application/x-www-form-urlencoded."
      },
      "muteHttpExceptions": {
        "type": "boolean",
        "description": "Whether to prevent exceptions from being thrown on HTTP errors (status codes 4xx or 5xx)."
      },
      "followRedirects": {
        "type": "boolean",
        "description": "Whether to automatically follow HTTP redirects (3xx responses). Defaults to true."
      },
      "validateHttpsCertificates": {
        "type": "boolean",
        "description": "Whether to validate HTTPS certificates. Defaults to true."
      },

    },
    "required": ["url", "user_question"]
  }
}
        ]
      }
    ]
  };
Logger.log("發送的 payload: " + JSON.stringify(payload, null, 2));

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(url, options);
    Logger.log("收到的初始回應: " + response.getContentText());

  var jsonResponse = JSON.parse(response.getContentText());

  // 解析並處理回應
  var finalResult = parseGeminiResponse(jsonResponse);
  Logger.log("最終結果: " + finalResult);

  return finalResult;

}

/**
 * 解析 Gemini 的回應並執行相應操作
 */
function parseGeminiResponse(response) {
  Logger.log("解析回應: " + JSON.stringify(response, null, 2));
  
  if (response.candidates && response.candidates.length > 0) {
    var candidate = response.candidates[0];
    
    // 檢查是否為 function call
    if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
      var part = candidate.content.parts[0];
      if (part.functionCall) {
        Logger.log("檢測到 function call: " + part.functionCall.name);
        var functionName = part.functionCall.name;
        // var args = JSON.parse(part.functionCall.args);
        var args = part.functionCall.args;
        Logger.log(functionName+" arg is  " + args);
        // 調用相應的函數
        // return functionName
        return executeFunctionCall(functionName, args);
      } else if (part.text) {
        // 如果是普通文本回應
        Logger.log("收到普通文本回應");
        return part.text;
      }
    }
  }
  Logger.log("未能解析 Gemini 的回應");
  return "未能解析 Gemini 的回應";
}




/**
 * 根據 function call 調度相應的函數
 */
function executeFunctionCall(functionName, args) {
  Logger.log("執行函數: " + functionName + "，參數: " + JSON.stringify(args, null, 2));
  
  if (functionName === "GeminiFetchUrl") {
    
    return GeminiFetchUrl(args);
  } else {
    Logger.log("未定義的函數名稱: " + functionName);
    return "未定義的函數名稱: " + functionName;
  }
}

/**
 * 執行抓取網頁內容的函數
 */
function GeminiFetchUrl(args) {

  Logger.log("先緩緩等待");


  Logger.log("開始抓取網頁內容，URL: " + args.url);

  var url = args.url;
  var method = args.method || "get";
  var headers = args.headers || {};
  var payload = args.payload || null;
  var contentType = args.contentType || "application/json";
  var muteHttpExceptions = args.muteHttpExceptions || false;
  var followRedirects = args.followRedirects !== undefined ? args.followRedirects : true;
  var validateHttpsCertificates = args.validateHttpsCertificates !== undefined ? args.validateHttpsCertificates : true;
  var user_question = args.user_question;

  var options = {
    "method": method,
    "headers": headers,
    "payload": payload,
    "contentType": contentType,
    "muteHttpExceptions": muteHttpExceptions,
    "followRedirects": followRedirects,
    "validateHttpsCertificates": validateHttpsCertificates
  };

  Logger.log("抓取網頁選項: " + JSON.stringify(options, null, 2));

  var response = UrlFetchApp.fetch(url, options);
  var content = response.getContentText();
  Logger.log("抓取到的內容: " + content);
  
  // 將抓取到的內容和用戶問題再發送給 Gemini
  return sendFinalRequestToGemini(user_question, content);
}

/**
 * 將用戶問題和抓取的數據發送回 Gemini 以獲取最終回答
 */
function sendFinalRequestToGemini(user_question, fetchedData) {
  var modelName = getModelName(); // 獲取模型名稱
  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

var payload = {
    "contents": [{
      "parts": [{
        "text": user_question +" 。 爬取的內容如下 " + fetchedData
      }]
    }]
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  Logger.log("發送最終請求的 payload: " + JSON.stringify(payload, null, 2));

  var response = UrlFetchApp.fetch(url, options);
  var finalResponse = JSON.parse(response.getContentText());
  
  Logger.log("最終回應: " + JSON.stringify(finalResponse, null, 2));
  var finalResult = finalResponse.candidates[0].content.parts[0].text;
  return finalResult;
}
