const express = require('express')
const app = express()
const port = 3000
const mysql2 = require('mysql2')
const bcrypt = require('bcrypt')
const multer = require('multer')
const {upload} = require('./maddlewave')


var cors = require('cors')
app.use('/food_images', express.static('./images'))
app.use('/rider_images', express.static('./images'))
const saltRound = 10
app.use(
  cors({
      origin: '*',
      credentials: true,
  }),
);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//mariadb://mark:C-sZ0RMSY@q8RLQB@console.aws.relist.dev:3366
const conn = mysql2.createConnection({
  port : '3306',
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database:'project'
});

//API read all Members
app.get('/members',cors(),async (req, res) => {
  let sql = "SELECT * FROM members"

  await conn.execute(sql,(err,result) => {
    if(err) {
      res.status(500).json({
        message : err.message
      })
      return
    }
    res.status(200).json({
      message : "เรียกข้อมูลสำเร็จ",
      data : result
    })
  })
})

//API insert member
app.post('/members',cors(),async (req, res) => {
  console.log(40)
  const { mem_email, mem_password, mem_name, mem_surname, mem_phone } = req.body
  console.log(42, req.body)
  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(mem_password, salt, (err, hash) => {
      let sql = "INSERT INTO members (mem_email, mem_password, mem_name, mem_surname, mem_phone) VALUES (?, ?, ?, ?, ?)";
      conn.execute(sql, 
        [mem_email,hash, mem_name, mem_surname, mem_phone],
         (err, result) => {
            if(err) {
              res.status(500).json({
                message : err.message, 
                statusCode : 500
              })
              return
            }
            res.status(201).json({
              message : "เพิ่มข้อมูลสำเร็จ",
              data : result, 
              statusCode: 200
            })
        })
    })
  })
})

//API read single member
app.get('/members/:mem_id',cors(),async (req, res) => {
  const { mem_id } = req.params
  let sql = "SELECT * FROM members WHERE mem_id = ?"
  conn.execute(sql,
    [mem_id],
    (err, result) => {
      if(err){
        res.status(500).json({
          message : err.message
        })
        return
      }
      res.status(200).json({
        message : "เรียกข้อมูลสำเร็จ",
        data : result
      })
    })
})

//API edit member
app.put('/members/:mem_id',cors(), async (req, res) => {
  const { mem_id } = req.params
  const { mem_email, mem_password } = req.body

  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(mem_password, salt,(err, hash) => {
      let sql = "UPDATE members SET mem_email =?, mem_password =? WHERE mem_id =?"
      conn.execute(sql,
        [mem_email, hash, mem_id],
        (err, result) => {
          if(err){
          res.status(500).json({
            message : err.message
          })
          return
          }
          res.status(200).json({
            message : "แก้ไขข้อมูลสำเร็จ",
            data : result
        })
      })
    })
  })
})

//API delete member
app.delete('/members/:mem_id',cors(), async (req, res) => {
  const { mem_id } = req.params
  let sql = "DELETE FROM members WHERE mem_id = ?"
  conn.execute(sql,
    [mem_id],
    (err, result) => {
      if(err){
        res.status(500).json({
          message : err.message
        })
        return
      }
      res.status(200).json({
        message : "ลบข้อมูลสำเร็จ",
        data : result
    })
  })
})
// END Members------------------------------------------------------------------------------------

// API Login member
app.post('/login',cors(),async (req, res) => {
  console.log(61,req.body)
  const { mem_email, mem_password } = req.body
    let sql = 'SELECT * FROM members WHERE mem_email = ? ';
await conn.execute(sql, [mem_email,], (err, result) => {
    if(err) {
      res.status(500).json({
        message : err.message
      })
      return
    }
    console.log(141,result)
    //ตรวจสอบค่าว่า result ต้องมี length
    if(!result.length) {
      res.status(500).json({
        message : '',
        status: 'fail'
      })
      return
    }
    console.log(mem_password)
    const a=bcrypt.compare(mem_password,result[0].mem_password)
    console.log(a)
    if(bcrypt.compare(mem_password,result[0].mem_password)){
      console.log(a , '-------------')
      res.status(200).json({
        message : "เรียกข้อมูลสำเร็จ",
        data : result,
        status : 'success'
      })
    }
    
  })
})
// end api login -----------------------------------------------------------------------------------------

// API Login rider
app.post('/login_rider',cors(),async (req, res) => {
  console.log(61,req.body)
  const { rider_email, rider_password } = req.body
    let sql = 'SELECT * FROM riders WHERE rider_email = ? ';
await conn.execute(sql, [rider_email,], (err, result) => {
    if(err) {
      res.status(500).json({
        message : err.message
      })
      return
    }
    console.log(141,result)
    //ตรวจสอบค่าว่า result ต้องมี length
    if(!result.length) {
      res.status(500).json({
        message : '',
        status: 'fail'
      })
      return
    }
    console.log(rider_password)
    const a = bcrypt.compare(rider_password,result[0].rider_password)
    console.log(a)
    if(bcrypt.compare(rider_password,result[0].rider_password)){
      console.log(a , '-------------')
      res.status(200).json({
        message : "เรียกข้อมูลสำเร็จ",
        data : result,
        status : 'success'
      })
    }
    
  })
})
// end api login -----------------------------------------------------------------------------------------

// API read all Rider
app.get('/riders',cors(),async (req, res) => {
  let sql = "SELECT * FROM riders"

  await conn.execute(sql,(err,result) => {
    if(err) {
      res.status(500).json({
        message : err.message
      })
      return
    }
    res.status(200).json({
      message : "เรียกข้อมูลสำเร็จ",
      data : result
    })
  })
})

// API insert rider
app.post('/riders',cors(),upload.single('rider_image'),async (req, res) => {
  console.log(req.file)
  const { rider_email, rider_password, rider_name, rider_surname, rider_phone } = req.body
  const rider_image = req.file.filename
  
  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(rider_password, salt, (err, hash) => {
      let sql = "INSERT INTO riders (rider_email, rider_password, rider_name, rider_surname, rider_phone, rider_image) VALUES (?, ?, ?, ?, ?, ?)";
      conn.execute(sql, 
        [rider_email,hash, rider_name, rider_surname, rider_phone, rider_image],
         (err, result) => {
            if(err) {
              res.status(500).json({
                message : err.message
              })
              return
            }
            res.status(201).json({
              message : "เพิ่มข้อมูลสำเร็จ",
              data : result
            })
        })
    })
  })
})

//API read single rider
app.get('/riders/:rider_id',cors(),async (req, res) => {
  const { rider_id } = req.params
  let sql = "SELECT * FROM riders WHERE rider_id = ?"
  conn.execute(sql,
    [rider_id],
    (err, result) => {
      if(err){
        res.status(500).json({
          message : err.message
        })
        return
      }
      res.status(200).json({
        message : "เรียกข้อมูลสำเร็จ",
        data : result
      })
    })
})

// API edit rider
app.put('/riders/:rider_id',cors(), async (req, res) => {
  const { rider_id } = req.params
  const { rider_email, rider_password } = req.body

  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(rider_password, salt,(err, hash) => {
      let sql = "UPDATE riders SET rider_email =?, rider_password =? WHERE rider_id =?"
      conn.execute(sql,
        [rider_email, hash, rider_id],
        (err, result) => {
          if(err){
          res.status(500).json({
            message : err.message
          })
          return
          }
          res.status(200).json({
            message : "แก้ไขข้อมูลสำเร็จ",
            data : result
        })
      })
    })
  })
})

// API delete rider
app.delete('/riders/:rider_id',cors(), async (req, res) => {
  const { rider_id } = req.params
  let sql = "DELETE FROM riders WHERE rider_id = ?"
  conn.execute(sql,
    [rider_id],
    (err, result) => {
      if(err){
        res.status(500).json({
          message : err.message
        })
        return
      }
      res.status(200).json({
        message : "ลบข้อมูลสำเร็จ"
    })
  })
})
// END Riders -----------------------------------------------------------------------------------------------------

// API  upload image+food
app.post('/food',cors(),upload.single('food_image'), (req, res) => {
  console.log(JSON.stringify(req.file.filename))
  const { food_name, food_price, food_status } = req.body
  const food_image = req.file.filename
  console.log(req.body)
  let sql = "INSERT INTO food (food_name, food_price, food_status, food_image) VALUES (?, ?, ?, ?)";
  conn.execute(
    sql,
    [food_name, food_price, food_status, food_image],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(201).json({
        message: "เพิ่มข้อมูลสำเร็จ",
        data: result,
      });
    }
  );
})

// read food
app.get('/food',cors(),async (req, res) => {
  let sql = "SELECT * FROM food"
  console.log(305)
  await conn.execute(sql,(err,result) => {
    if(err) {
      res.status(500).json({
        message : err.message
      })
      return
    }
    result.button_status = false  //ใช้เพื่อแสดงปุ่มเปลี่ยนสถานะ
    res.status(200).json({
      message : "เรียกข้อมูลสำเร็จ",
      data : result
    })
  })
})

//delete food
app.delete('/food/:food_id',cors(), async (req, res) => {
  const { food_id } = req.params
  console.log(req.params)
  let sql = "DELETE FROM food WHERE food_id = ?"
  conn.execute(sql,
    [food_id],
    (err, result) => {
      if(err){
        res.status(500).json({
          message : err.message
        })
        return
      }
      res.status(200).json({
        message : "ลบข้อมูลสำเร็จ"
    })
  })
})

// API change ststus_food
app.put('/food/food_id', async (req, res) => {
  console.log(req.body)
  const { food_id, status } = req.body

  let sql = "UPDATE food SET food_status =? WHERE food_id =?"
      conn.execute(sql,
        [status, food_id],
        (err, result) => {
          if(err){
          res.status(500).json({
            message : err.message
          })
          return
          }
          res.status(200).json({
            message : "แก้ไขข้อมูลสำเร็จ",
            data : result
        })
      })
})

//API creat food
app.post('/foodtest',cors(), (req, res) => {
  console.log(req.body)
  const { food_name, food_price, food_status } = req.body
  
  let sql = "INSERT INTO food (food_name, food_price, food_status) VALUES (?, ?, ?)";
  conn.execute(
    sql,
    [food_name, food_price, food_status],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(201).json({
        message: "เพิ่มข้อมูลสำเร็จ",
        data: result,
      });
    }
  );
})
// end food API----------------------------------------------------------------

//API add cart 
app.post("/addMenutoCart", (req, res) => {
  const {
    mem_id,
    food_id,
    quantity
  } = req.body
  console.log(req.body)
  const sql = "INSERT INTO cart(mem_id, food_id, quantity) VALUES(?, ?, ?)"
  conn.execute( 
    sql,
    [
      mem_id,
      food_id,
      quantity
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(201).json({
        message: "เพิ่มเมนูลงตะกร้าแล้ว",
        data: {
          mem_id,
          food_id,
          quantity
        }
      });
    }
  )
})
//end

// get menu in cart
app.get("/menuInCart", (req, res) => {
  const {
    mem_id,
    status
  } = req.body
  const sql = "SELECT * FROM cart WHERE mem_id = ? AND status = ?"
  conn.execute(
    sql,
    [
      mem_id,
      status
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      res.status(201).json({
        message: "เมนูในตะกร้า",
        data: result,
      });
    }
  )
})//END

// API edit quantity in cart
app.put("/editcart", (req, res) => {
    const {
      quantity,
      mem_id,
      food_id,
      cart_id,
      status
    } =  req.body
 
    if (status === 0) {
      const sql = "UPDATE cart SET quantity = ? WHERE mem_id = ? AND food_id = ? AND cart_id AND status = ?"
      conn.execute(
        sql,
        [
          quantity,
          mem_id,
          food_id,
          cart_id,
          status
        ],
        (err, result) => {
          if (err) {
            res.status(500).json({
              message: err.message,
            });
            return;
          }
          res.status(201).json({
            message: "เปลี่ยนแปลงจำนวนแล้ว",
            data: result,
          });
        }
      )
    }
})
//END
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})