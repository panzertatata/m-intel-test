# API Documentation
## Create Book API
** Method **: GET
** Path **: /book
  api เส้นนี้มีไว้สำหรับการสร้าง book ลงใน database ซึ่งจะมีการเช็คว่าข้อมูลหนังสือนั้นเคยมีอยู่ในระบบหรือไม่โดยการเช็ค title, genre,publicationYear, author ถ้า
** Example Response **:
  ** Http status code **: 200
  กรณีที่สร้างเสร็จสมบูรณ์
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
  ** Http status code **: 409
  กรณีที่เจอซ้ำใน database
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