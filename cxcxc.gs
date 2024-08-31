/**
 * 這段程式碼是為雲育鏈職場AI軟體暨雲端應用課程所設計。
 * 課程內容涵蓋了如何使用Google Apps Script來自動化業務流程，
 * 並應用於AI代理人的開發與雲端應用的整合。
 * 
 * 更多課程資訊請參考雲育鏈官網：https://www.cxcxc.io/agentic-ai-course/
 * 
 * 授權條款：如需課程包班合作，可加入Line官方號進行 https://lin.ee/nlPnBYS。
 */


// api 網址
// https://ai.google.dev/gemini-api/docs/api-versions?hl=zh-tw
// https://ai.google.dev/gemini-api/docs/function-calling

// 將Google API Key 當成環境變數
const apiKey = PropertiesService.getScriptProperties().getProperty("GOOGLE_AI_API_KEY")

/**
 * GeminiQA
 * 此函數透過Google Apps Script調用Gemini API，針對單一問題進行問答生成。
 * 功能：接受一個問題字串，並使用Gemini API生成對應的答案。
 */
function GeminiQA(question) {
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
  var payload = {
    "contents": [{
      "parts": [{
        "text": question
      }]
    }]
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    // 取出 content 的 parts 中的 text
    var answer = json.candidates[0].content.parts[0].text;
    
    return answer;
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return null;
  }
}

/**
 * GeminiQAFromImage
 * 此函數處理圖片分析的問答，將圖片轉換為Base64格式後發送給Gemini API。
 * 功能：接受問題和圖片網址，並通過API返回解析結果。
 */
function GeminiQAFromImage(question, image_url) {


  // 下載圖片
  var imageBlob = UrlFetchApp.fetch(image_url).getBlob();

  // 獲取圖片的 MIME 類型
  var mimeType = imageBlob.getContentType();

  // 將圖片轉換為Base64
  var imageBase64 = Utilities.base64Encode(imageBlob.getBytes());
  
  // 構建API請求的數據
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

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    // 取出 content 的 parts 中的 text
    var answer = json.candidates[0].content.parts[0].text;
    
    return answer; // 返回字串結果
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return null;
  }
}


/**
 * GeminiClassify
 * 此函數實現文本分類，將輸入的文本根據指定分類進行分類操作。
 * 功能：接受分類數組與文本內容，並使用Gemini API進行分類。
 */
function GeminiClassify(class_array, content, extra_prompt="") {

  // 將 class_array 結合為一個 String
  var classString = class_array.join(", ");

  // 組合 prompt
  var prompt = "請將以下內容分類為：" + classString + " 。 直接告訴我分類就好，不需要解釋。"+ extra_prompt +"。 內容：" + content ;

  // 構建API請求的數據
  var payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    Logger.log(json);
    // 取出 content 的 parts 中的 text
    var classification = json.candidates[0].content.parts[0].text;
    
    return classification.replace(/\r?\n|\r/g, '');; // 返回分類結果
    // return json; // 返回分類結果
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return "Error: " + error.toString();
  }
}

/**
 * GeminiVector001
 * 此函數生成文本的向量表示，適用於需要計算文本相似度的場景。
 * 功能：接受輸入文本，使用Gemini API生成對應的向量。
 */
function GeminiVector001(input_value) {
  

  // 構建API請求的數據
  var payload = {
    "model": "models/embedding-001",
    "content": {
      "parts": [{
        "text": input_value
      }]
    }
  };

  var url = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=" + apiKey;

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    // 檢查並提取 embedding 的值
    if (json.embedding && json.embedding.values) {
      // 將數組轉換為單一字串
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


/**
 * GeminiVectorSimilarCalculate
 * 此函數計算兩個向量之間的相似度，返回相似度分數。
 * 功能：接受兩個向量字串，計算其餘弦相似度。
 */
function GeminiVectorSimilarCalculate(vector1_string, vector2_string) {
  // 將字串轉換為數字數組
  var vector1 = vector1_string.split(",").map(Number);
  var vector2 = vector2_string.split(",").map(Number);

  // 確保兩個向量的長度相同
  if (vector1.length !== vector2.length) {
    return "Error: Vectors must have the same length.";
  }

  // 計算餘弦相似度
  var dotProduct = 0;
  var magnitude1 = 0;
  var magnitude2 = 0;

  for (var i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return "Error: One of the vectors has zero magnitude.";
  }

  var similarity = dotProduct / (magnitude1 * magnitude2);
  return similarity; // 返回相似度結果
}

/**
 * doGet
 * 此函數處理HTTP GET請求，並根據傳入的查詢參數對指定的Google Sheets中的數據進行查詢、過濾、分頁等操作。
 * 
 * 功能概述：
 * - 根據傳入的工作表名稱（sheet_name）和查詢模式（query_mode）進行數據查詢。
 * - 支持三種查詢模式：
 *   - normal：正常的精準查詢，根據指定條件篩選數據，並返回符合條件的結果。
 *   - rag：在精準查詢的基礎上，基於向量相似度進行進階查詢。會根據search_term生成向量，並與指定欄位中的向量數據進行相似度比較，然後根據指定的threshold進行過濾，僅保留相似度大於等於threshold的結果。向量比較後，將移除所有與向量相關的欄位。
 *   - graph_rag：預留未實現模式。
 * - 支持根據指定的條件（filter_column）對數據進行篩選，如大於、小於、等於等。在RAG模式下，先進行篩選再進行向量比較。
 * - 可以指定需要排除的欄位（exclude_column），這些欄位將不會出現在返回的結果中。RAG模式下，篩選和向量比較後，會移除帶有 "vector" 字樣的欄位。
 * - 可以限制返回的記錄數量（query_item_limit），以及支持分頁（page 和 pageSize）。
 * - 查詢結果將以 JSON 格式返回，並且會記錄每次請求的日誌，包含時間戳和查詢參數。
 * 
 * Query String 參數：
 * - sheet_name (required): 要查詢的工作表名稱。
 * - query_mode (optional): 查詢模式，支持 normal、rag 和 graph_rag，預設為 normal。
 * - exclude_columns (optional): 需要排除的欄位名稱列表，以逗號分隔（如 colA,colB,colC）。
 * - filter_column (optional): 篩選條件，指定格式為 "欄位名[運算符]值"，可包含多個條件，以逗號分隔。
 * - page (optional): 返回結果的頁碼，預設為第1頁。
 * - page_size (optional): 每頁返回的記錄數量，預設為10。
 * - search_term (required for rag): 用於 RAG 模式的查詢字串，將轉換為向量進行相似度比較。
 * - compare_vector_column (required for rag): 用於與 search_term 生成的向量進行比較的欄位名稱。
 * - threshold (optional for rag): 用於過濾 RAG 模式結果的相似度閾值，僅保留相似度大於等於該閾值的結果。
 * 
 * 返回結果：
 * - 結果將以 JSON 格式返回，包含符合條件的查詢結果。
 * - 在 RAG 模式下，結果中將包含一個新欄位 "threshold"，表示相似度分數。
 * - 在 RAG 模式的最終結果中，所有與向量相關的欄位將被移除。
 * 
 * 記錄日誌：
 * - 每次請求都會記錄日誌，日誌格式為 "timestamp=xxxxx&user_query=???"
 * 
 * 主要邏輯：
 * 1. 解析查詢參數並初始化變數。
 * 2. 獲取指定的Google Sheets中的所有數據。
 * 3. 在 normal 和 rag 模式下根據查詢模式應用不同的查詢邏輯。
 * 4. 根據篩選條件過濾數據。在 RAG 模式下，先進行一般篩選，再進行向量相似度比較。
 * 5. 對 RAG 模式下的結果應用相似度比較和閾值過濾，並在結果中添加相似度分數。
 * 6. 如果指定了最大記錄數量，則限制返回的結果數量。
 * 7. 在 RAG 模式下，完成向量比較後移除所有與向量相關的欄位。
 * 8. 應用分頁邏輯。
 * 9. 記錄請求日誌。
 * 10. 返回結果。
 */
function doGet(e) {
  // 解析 query string 參數
  var sheetName = e.parameter.sheet_name;
  var excludeColumns = e.parameter.exclude_columns ? e.parameter.exclude_columns.split(",").map(col => col.toLowerCase().trim()) : [];
  var queryMode = e.parameter.query_mode ? e.parameter.query_mode.toLowerCase() : "normal";
  var page = e.parameter.page ? parseInt(e.parameter.page) : 1;
  var pageSize = e.parameter.page_size ? parseInt(e.parameter.page_size) : 10;

  Logger.log("Sheet Name: " + sheetName);
  Logger.log("Exclude Columns: " + excludeColumns);
  Logger.log("Query Mode: " + queryMode);
  Logger.log("Page: " + page + ", Page Size: " + pageSize);
  Logger.log(e.parameter);

  // 獲取指定工作表
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    Logger.log("Error: Sheet not found.");
    return ContentService.createTextOutput("Error: Sheet not found.");
  }

  // 獲取標題行
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log("Headers: " + JSON.stringify(headers));

  // 計算要讀取的資料範圍
  var startRow = (page - 1) * pageSize + 2;
  var endRow = startRow + pageSize - 1;
  Logger.log("Start Row: " + startRow + ", End Row: " + endRow);

  // 確保不超過表格的總行數
  var lastRow = sheet.getLastRow();
  Logger.log("Last Row in Sheet: " + lastRow);
  if (startRow > lastRow) {
    Logger.log("No Data: Returning Empty Array");
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  }
  if (endRow > lastRow) {
    endRow = lastRow;
  }

  // 獲取資料範圍
  var dataRange = sheet.getRange(startRow, 1, endRow - startRow + 1, sheet.getLastColumn());
  var data = dataRange.getValues();
  Logger.log("Data Retrieved: " + JSON.stringify(data));

  // 取得需要保留的欄位索引
  var validIndices = [];
  headers.forEach((header, index) => {
    var lowerHeader = header.toLowerCase().trim();
    // 在 RAG 模式下，不立即移除包含 "vector" 的欄位
    if (queryMode === "rag" || (!lowerHeader.includes("vector") && !excludeColumns.includes(lowerHeader))) {
      validIndices.push(index);
    }
  });
  Logger.log("Valid Indices: " + validIndices);

  // 解析所有的 query string 作為篩選條件
  var filters = parseQueryStringsAsFilters(e.parameter, headers);
  Logger.log("Filters: " + JSON.stringify(filters));

  var results = [];

  if (queryMode === "normal") {
    // 正常模式下的查詢邏輯
    for (var i = 0; i < data.length; i++) {
      if (applyFilters(data[i], filters)) {
        let resultObject = {};
        validIndices.forEach(index => {
          const header = headers[index];
          if (!excludeColumns.includes(header.toLowerCase().trim())) {
            resultObject[header] = data[i][index];
          }
        });
        results.push(resultObject);
      }
    }
  } else if (queryMode === "rag") {
    // RAG 模式下的查詢邏輯
    var searchTerm = e.parameter.search_term;
    var compareVectorColumn = e.parameter.compare_vector_column ? e.parameter.compare_vector_column.toLowerCase().trim() : null;
    var threshold = e.parameter.threshold ? parseFloat(e.parameter.threshold) : 0.7;

    if (!searchTerm || !compareVectorColumn) {
      return ContentService.createTextOutput("Error: Missing search_term or compare_vector_column for RAG mode.").setMimeType(ContentService.MimeType.JSON);
    }

    // 將 searchTerm 轉換為向量字串
    var searchTermVector = GeminiVector001(searchTerm);
    Logger.log("Search Term Vector: " + searchTermVector);

    // 先應用篩選條件
    var filteredResults = [];
    for (var i = 0; i < data.length; i++) {
      if (applyFilters(data[i], filters)) {
        let resultObject = {};
        validIndices.forEach(index => {
          const header = headers[index];
          resultObject[header] = data[i][index];
        });
        filteredResults.push(resultObject);
      }
    }

    // 對篩選後的結果進行向量比較
    for (var i = 0; i < filteredResults.length; i++) {
      var resultObject = filteredResults[i];
      var vectorValue = resultObject[compareVectorColumn];

      var similarity = GeminiVectorSimilarCalculate(searchTermVector, vectorValue);
      Logger.log("Similarity: " + similarity);

      if (similarity >= threshold) {
        resultObject["threshold"] = similarity; // 添加相似度分數
        results.push(resultObject);
      }
    }

    // 完成向量比較後，移除 vector 相關欄位
    results = results.map(result => {
      validIndices.forEach(index => {
        const header = headers[index];
        if (header.toLowerCase().trim().includes("vector") || excludeColumns.includes(header.toLowerCase().trim())) {
          delete result[header];
        }
      });
      return result;
    });
  } else if (queryMode === "graph_rag") {
    // TODO: 添加 graph_rag 模式的查詢邏輯
  }

  Logger.log("Results: " + JSON.stringify(results));

  // 記錄 log
  var log = "timestamp=" + new Date().toISOString() + "&user_query=" + JSON.stringify(e.parameters);
  Logger.log("Log: " + log);

  saveLogToSheet("GET資料記錄", log);

  // 返回結果，以 JSON 格式返回過濾後的結果數據
  return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
}

function parseQueryStringsAsFilters(params, headers) {
  var filters = [];
  var operators = ["<=", ">=", "<", ">", "=", "!="];

  for (var key in params) {
    if (params.hasOwnProperty(key) && key !== 'sheet_name' && key !== 'query_item_limit' && key !== 'exclude_column' && key !== 'page' && key !== 'pageSize') {
      var value = params[key].trim();
      var operatorFound = false;

      for (var i = 0; i < operators.length; i++) {
        var operator = operators[i];

        // 情况1：运算符在键名的结尾
        if (key.endsWith(operator)) {
          var columnName = key.substring(0, key.length - operator.length).trim().toLowerCase();
          var filterValue = value;
          var index = headers.findIndex(header => header.toLowerCase() === columnName);
          if (index !== -1) {
            filters.push({ index: index, operator: operator, value: filterValue });
            operatorFound = true;
            break;
          }
        }

        // 情况2：运算符在值的开头
        if (value.startsWith(operator)) {
          var columnName = key.trim().toLowerCase();
          var filterValue = value.substring(operator.length).trim();
          var index = headers.findIndex(header => header.toLowerCase() === columnName);
          if (index !== -1) {
            filters.push({ index: index, operator: operator, value: filterValue });
            operatorFound = true;
            break;
          }
        }
      }

      // 如果没有找到运算符，假定是等于条件
      if (!operatorFound) {
        var columnName = key.trim().toLowerCase();
        var filterValue = value;
        var index = headers.findIndex(header => header.toLowerCase() === columnName);
        if (index !== -1) {
          filters.push({ index: index, operator: "=", value: filterValue });
        }
      }
    }
  }

  Logger.log("Parsed Filters: " + JSON.stringify(filters));
  return filters;
}


// 應用篩選條件
function applyFilters(row, filters) {
  for (var i = 0; i < filters.length; i++) {
    var filter = filters[i];
    var cellValue = row[filter.index];

    switch (filter.operator) {
      case "<=":
        if (!(cellValue <= filter.value)) return false;
        break;
      case ">=":
        if (!(cellValue >= filter.value)) return false;
        break;
      case "<":
        if (!(cellValue < filter.value)) return false;
        break;
      case ">":
        if (!(cellValue > filter.value)) return false;
        break;
      case "=":
        if (!(cellValue == filter.value)) return false;
        break;
      case "!=":
        if (!(cellValue != filter.value)) return false;
        break;
    }
  }
  return true;
}


/**
 * doPost
 * 
 * 此函數處理HTTP POST請求，將請求的JSON數據插入到指定的Google Sheets工作表中，並根據表頭自動匹配相應的列進行數據插入。
 * 
 * 功能概述：
 * - 解析並處理POST請求中的JSON數據。
 * - 根據傳入的工作表名稱（sheet_name）選擇要操作的Google Sheets工作表。
 * - 自動將JSON數據中的key與工作表的表頭進行匹配，並將相應數據插入到對應的列。
 * - 如果表頭包含"vector"字樣，則自動生成向量表示並插入到該列中。
 * - 在插入數據後，返回操作結果的JSON響應。
 * - 每次請求都會記錄日誌，以便後續調試和追蹤。
 * 
 * POST Body 參數：
 * - sheet_name (required): 要插入數據的Google Sheets工作表名稱。
 * - 其他參數：與Google Sheets中的列名相對應的key，插入數據時會自動匹配到相應的列。
 *   - 例如，若工作表有列名 "asset_name" 和 "asset_category"，則POST Body應包含 "asset_name": "Laptop", "asset_category": "Electronics" 這類形式的數據。
 * 
 * 返回結果：
 * - JSON格式，包含一個 `result` 欄位，指示操作是否成功：
 *   - "success" 表示成功插入數據。
 *   - "failure" 表示操作失敗，並包含 `error` 欄位描述錯誤訊息。
 * 
 * 記錄日誌：
 * - 每次請求都會記錄日誌，格式為 "timestamp=xxxxx&request_body=???&result=???"
 * 
 * 主要邏輯：
 * 1. 解析POST請求中的JSON數據，並檢查必須的參數 `sheet_name` 是否存在。
 * 2. 根據 `sheet_name` 獲取對應的Google Sheets工作表。
 * 3. 將JSON數據中的key與工作表的表頭進行匹配，並將數據插入到對應的列。
 * 4. 如果表頭中有包含"vector"字樣的欄位，則調用向量生成函數來生成向量表示並插入。
 * 5. 記錄操作日誌，包括時間戳和請求內容。
 * 6. 返回操作結果，成功則返回 "success"，否則返回 "failure" 和錯誤訊息。
 */
function doPost(e) {
  try {
    // 解析POST請求中的JSON數據
    var requestBody = JSON.parse(e.postData.contents);
    Logger.log("Request Body: " + JSON.stringify(requestBody));
    
    // 確認sheet_name參數是否存在
    var sheetName = requestBody.sheet_name;
    if (!sheetName) {
      throw new Error("Missing sheet_name parameter.");
    }

    // 獲取指定的工作表
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet not found: " + sheetName);
    }

    // 獲取標題行
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log("Headers: " + JSON.stringify(headers));

    // 構建要插入的數據行
    var newRow = [];
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      var lowerHeader = header.toLowerCase().trim();
      var matchedKey = Object.keys(requestBody).find(key => lowerHeader.includes(key.toLowerCase().trim()));
      var value = matchedKey ? requestBody[matchedKey] : undefined;

      if (value === undefined) {
        // 如果JSON中沒有對應的key，則插入空值
        newRow.push('');
      } else if (lowerHeader.includes("vector") && matchedKey) {
        // 如果header包含"vector"字樣，並且匹配到相應的json key，則調用GeminiVector001生成向量
        var vector = GeminiVector001(value);
        Logger.log("Generated Vector for " + matchedKey + ": " + vector);
        newRow.push(vector);
      } else {
        // 正常插入數據
        newRow.push(value);
      }
    }

    // 將數據行插入到工作表的下一行
    sheet.appendRow(newRow);
    
    // 記錄操作成功的日誌
    Logger.log("Data inserted successfully into sheet: " + sheetName);
    

    var log = "timestamp=" + new Date().toISOString() + "&user_payload=" + JSON.stringify(e.postData.contents);
    Logger.log("Log: " + log);

    saveLogToSheet("POST資料記錄", log);

    // 返回成功結果
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 捕捉錯誤並記錄日誌
    Logger.log("Error: " + error.message);

    // 返回失敗結果
    return ContentService.createTextOutput(JSON.stringify({ result: "failure", error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


function saveLogToSheet(sheetName, log) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  sheet.appendRow([new Date().toISOString(), log]);
}


// Gemini with Webscraper
// https://apify.com/store


// Gemini with Function tool
function GeminiQAWithWeb(user_question) {
  
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
  
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
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

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
