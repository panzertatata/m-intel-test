# API Documentation
## Create Book API
  api เส้นนี้มีไว้สำหรับการสร้าง book ลงใน database ซึ่งจะมีการเช็คว่าข้อมูลหนังสือนั้นเคยมีอยู่ในระบบหรือไม่โดยการเช็ค title, genre publicationYear, author ถ้ามีจะทำการโชว์ error แต่ถ้าไม่มีก็สามารถสร้างได้<br/>
  >**Note**: หากจะเพิ่มหนังสือชนิดเดิมใช้เป็นการ update remaining แทน
  >
  **Method**: PUT<br/>
  **Path**: /book<br/>
  **Request parameter example**:<br/>
  ```
  [{
    "title": "mockTitle9" //string required,
    "genre": "mockGenre2"  //string required,
    "author": "mockA2"  //string required,
    "publicationYear": "1999"  //string required,
    "price": 200  //number required (greater than equal 0),
    "remaining": 1  //string optional (default = 0) (greater than equal 0)
  }]
  ```
  title คือ ชื่อหนังสือ<br/>
  genre คือ หมวดหมู่<br/>
  author คือ ชื่อผู้แต่ง<br/>
  publicationYear คือ ปีที่พิมพ์<br/>
  price คือ ราคา<br/>
  remaining คือ จำนวนคงเหลือ<br/>

  **Example Response**:<br/>
  - **Http status code**: 200<br/>
  กรณีที่สร้างเสร็จสมบูรณ์จะ response ข้อมูล book ที่ถูกสร้างทั้งหมดออกมา<br/>
  ```
  [
    {
        "title": "mockTitle9",
        "genre": "mockGenre2",
        "author": "mockA2",
        "publicationYear": "1999",
        "price": 200,
        "remaining": 1,
        "id": 7
    }
  ]
  ```
  - **Http status code**: 400<br/>
  กรณีที่ส่ง body ที่มี format ผิด
  ```
  {
    "statusCode": 400,
    "response": {
        "message": "Invalid Payload",
        "error": "Bad Request",
        "statusCode": 400
    },
    "timestamp": "2025-02-07T08:24:09.467Z"
  }
  ```
  - **Http status code**: 409<br/> 
  กรณีที่เจอซ้ำใน database จะ response ข้อมูล book ที่อยู่ใน database ที่ซ้ำออกมา
  ```
  {
    "statusCode": 409,
    "response": {
        "message": "book(s) have been created.",
        "book": [
            {
                "id": 7,
                "title": "mockTitle9",
                "genre": "mockGenre2",
                "author": "mockA2",
                "publicationYear": "1999",
                "price": 200,
                "remaining": 1
            }
        ]
    },
    "timestamp": "2025-02-07T07:00:06.712Z"
  }
  ```

## Update Book API
  api เส้นนี้มีไว้ update book ที่มีอยู่แล้วใน database ซึ่งจะใช้ id ในการค้นหาข้แมูลที่จะ update หากไม่มีจะโชว์ error ถ้าหากมีจะทำการ update book นั้น
  **Method**: POST<br/>
  **Path**: /book<br/>
  **Request parameter example**:<br/>
  ```
  {
    "id": 3 //number required,
    "title": "mockTitle" //string optional,
    "genre": "mockGenre" //string optional,
    "author": "mockA" //string optional,
    "publicationYear": //string optional,
    "price": 600 //number optional (greater than equal 0),
    "remaining": {
        "value": 3 //number required (greater than equal 0),
        "operator": "add" //string required
    }//object optional
  }
  ```
  operator ที่ support มี 'add' , 'remove' , 'replace'<br/>
    - การ add เป็นการเพิ่มจากเดิม<br/>
    - การ remove เป็นการลบจากเดิม<br/>
    >**NOTE**: หาก remove แล้ว remaining เหลือน้อยกว่า 0 จะ error บอกว่า book ไม่พอ
    >
    - การ replace เป็นการแทนที่ของเก่า<br/>

  **Example Response**:<br/>
    - **Http status code**: 200<br/>
    กรณีที่ update เสร็จสิ้นจะ response ข้อมูล book ที่ถูก update ออกมา
    ```
    {
        "title": "mockTitle9",
        "genre": "mockGenre2",
        "author": "mockA2",
        "publicationYear": "1999",
        "price": 200,
        "remaining": 1,
        "id": 7
    }
    ```
    - **Http status code**: 404<br/>
    กรณีที่หา book ที่ตรงกับ id ที่ส่งเข้ามาไม่เจอ
    ```
    {
      "statusCode": 404,
      "response": {
          "message": "book not found",
          "id": 100
      },
      "timestamp": "2025-02-07T08:22:55.360Z"
    }
    ```
    - **Http status code**: 400<br/>
    กรณีที่ส่ง operator เข้ามาผิดหรือกรณีที่ส่ง body ที่มี format ผิด
    ```
    {
      "statusCode": 400,
      "response": {
          "message": "Invalid Payload",
          "error": "Bad Request",
          "statusCode": 400
      },
      "timestamp": "2025-02-07T08:24:09.467Z"
    }
    ```
    - **Http status code**: 500<br/>
      กรณีที่ส่ง operator remove เข้ามาแล้ว remaining ของ book ใน database มีน้อยกว่า
    ```
    {
      "statusCode": 500,
      "response": {
          "message": "The book is not enough"
      },
      "timestamp": "2025-02-07T08:21:12.127Z"
    }
    ```

## Search Book API
  api เส้นนี้มีไว้ค้นหา book ที่มีอยู่แล้วใน database
  **Method**: GET<br/>
  **Path**: /book<br/>
  **Request parameter example**:<br/>
  ```
  {
    "id": 1 //number optional,
    "title": {
        "value": "mockTitle" //string optional,
        "operator": "exact" //string optional
    } //object optional,
    "genre": {
        "value": "mockGenre" //string optional,
        "operator": "exact" //string optional
    } //object optional
  }
  ```
  key ที่สามารถส่งเป็น body request ได้คือ key ที่เป็นของ book ทั้งหมด<br/>
  การหา book ด้วย key 'id' จะต้องเป็น number เท่านั้น แต่ key อื่นๆ จะต้องมี value เป็น object ที่มีหน้าตา
  ```
  {
    value: string,
    operator: string,
  }
  ```
  operator ที่ support มี 'exact', 'partial', 'range', 'gte', 'lte'<br/>
  โดยที่ข้อมูลที่ต้องการค้นหาเป็น string จะมี 2 operator ที่ใช้ได้คือ exact กับ partial หากข้อมูลที่ต้องการค้นหาเป็น number จะต้องส่ง body request เป็น string ซึ่งจะมี operator ที่ใช้ได้คือ 'exact', 'range', 'gte', 'lte'
  >**Note**: format ของ value หากใช้ operator เป็น range มีหน้าตาเช่น '30-50', '4-6'
  >

  **Example Response**:<br/>
    - **Http status code**: 200<br/>
    กรณีที่หา book เจอ
    ```
    [
      {
          "id": 5,
          "title": "mockTitle40",
          "genre": "mockGenre10",
          "author": "mockA2",
          "publicationYear": "1999",
          "price": 200,
          "remaining": 10
      }
    ]
    ```
    กรณีที่หา book ไม่เจอ
    ```
    []
    ```
    - **Http status code**: 400<br/>
    กรณีที่ส่ง operator เข้ามาผิดหรือกรณีที่ส่ง body ผิด format 
    ```
    {
      "statusCode": 400,
      "response": {
          "message": "Invalid Payload",
          "error": "Bad Request",
          "statusCode": 400
      },
      "timestamp": "2025-02-07T08:51:18.358Z"
    }
    ```
  
## Delete Book API
  api เส้นนี้มีไว้ลบ book ที่มีอยู่แล้วใน database
  **Method**: DELETE<br/>
  **Path**: /book<br/>
  **Request parameter example**:<br/>
  ```
  {
    "id": 4
  }
  ```
  api เส้นนี้จะรับเพียง id เท่านั้นและจะมีการเช็คว่าหากมี id ที่ส่งเข้ามาอยู่ใน database จะทำการลบถ้าไม่มีจะโชว์ error
    **Example Response**:<br/>
      - **Http status code**: 200<br/>
      กรณีที่ลบ book สำเร็จ
      ```
      {
        "raw": [],
        "affected": 1
      }
      ```
      - **Http status code**: 400<br/>
      กรณีที่ส่ง body ผิด format 
      ```
      {
        "statusCode": 400,
        "response": {
            "message": "Invalid Payload",
            "error": "Bad Request",
            "statusCode": 400
        },
        "timestamp": "2025-02-07T08:51:18.358Z"
      }
      ```
      กรณีทีหา book ไม่เจอ
      ```
      {
        "statusCode": 404,
        "response": {
          "message": "book not found",
          "id": 200
        },
        "timestamp": "2025-02-07T09:02:25.477Z"
      }
      ```