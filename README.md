# API Documentation
## Create Book API
  api เส้นนี้มีไว้สำหรับการสร้าง book ลงใน database ซึ่งจะมีการเช็คว่าข้อมูลหนังสือนั้นเคยมีอยู่ในระบบหรือไม่โดยการเช็ค title, genre,publicationYear, author ถ้ามีจะทำการโชว์ error แต่ถ้าไม่มีก็สามารถสร้างได้<br/>
  >**Note**: หากจะเพิ่มหนังสือชนิดเดิมใช้เป็นการ update remaining แทน
  >
**Method**: GET<br/>
**Path**: /book<br/>
**Request parameter example**:<br/>
  ```
  [{
    "title": "mockTitle9",
    "genre": "mockGenre2",
    "author": "mockA2",
    "publicationYear": "1999",
    "price": 200,
    "remaining": 1
  }]
  ```
  tile คือ ชื่อหนังสือ
  genre คือ หมวดหมู่
  author คือ ชื่อผู้แต่ง
  publicationYear คือ ปีที่พิมพ์
  price คือ ราคา
  remaining คือ จำนวนคงเหลือ

**Example Response**:<br/>
**Http status code**: 200<br/>
  กรณีที่สร้างเสร็จสมบูรณ์จะ response ข้อมูล book ที่ถูกสร้างทั้งหมดออกมา
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
**Http status code**: 409<br/>
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
## Search Book API
## Delete Book API