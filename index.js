const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcryptjs");
const { upload } = require("./maddlewave");

const port = 3000;
const app = express();
const saltRound = 10;
var cors = require("cors");

app.use("/food_images", express.static("./images"));
app.use("/rider_images", express.static("./images"));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = mysql2.createConnection({
  port: "3366",
  host: "console.aws.relist.dev",
  user: "mark",
  password: "C-sZ0RMSY@q8RLQB",
  database: "mark_project",
});

//instantiate the connection
conn.connect(function (err) {
  if (err) {
    console.log(`connectionrequest failed ${err.stack}`);
  } else {
    console.log(`db connectionrequest successful ${conn.threadId}`);
  }
});

app.get("/", (req, res) => {
  res.send("ok");
});

//API read all Members
app.get("/members", cors(), async (req, res) => {
  let sql = "SELECT * FROM members";

  await conn.execute(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

//API insert member
app.post("/members", cors(), async (req, res) => {
  const {
    mem_email,
    mem_password,
    mem_name,
    mem_surname,
    mem_phone,
    mem_address,
  } = req.body;
  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(mem_password, salt, (err, hash) => {
      let sql =
        "INSERT INTO members (mem_email, mem_password, mem_name, mem_surname, mem_phone, mem_address) VALUES (?, ?, ?, ?, ?, ?)";
      conn.execute(
        sql,
        [mem_email, hash, mem_name, mem_surname, mem_phone, mem_address],
        (err, result) => {
          if (err) {
            conn.rollback;
            res.status(500).json({
              message: err.message,
              statusCode: 500,
            });
            return;
          }
          res.status(201).json({
            message: "เพิ่มข้อมูลสำเร็จ",
            data: result,
            statusCode: 200,
          });
        }
      );
    });
  });
});

//API read single member
app.get("/members/:mem_id", cors(), async (req, res) => {
  const { mem_id } = req.params;
  let sql = "SELECT * FROM members WHERE mem_id = ?";
  conn.execute(sql, [mem_id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

//API edit member
app.put("/members/:mem_id", cors(), async (req, res) => {
  const { mem_id } = req.params;
  const { mem_email, mem_password } = req.body;

  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(mem_password, salt, (err, hash) => {
      let sql =
        "UPDATE members SET mem_email =?, mem_password =? WHERE mem_id =?";
      conn.execute(sql, [mem_email, hash, mem_id], (err, result) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
          return;
        }
        res.status(200).json({
          message: "แก้ไขข้อมูลสำเร็จ",
          data: result,
        });
      });
    });
  });
});
// END Members------------------------------------------------------------------------------------

// API Login member
app.post("/login", cors(), async (req, res) => {
  console.log(61, req.body);
  const { mem_email, mem_password } = req.body;
  let sql = "SELECT * FROM members WHERE mem_email = ? ";
  await conn.execute(sql, [mem_email], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    console.log(141, result);
    //ตรวจสอบค่าว่า result ต้องมี length
    if (!result.length) {
      res.status(401).json({
        message: "",
        status: "fail",
      });
      return;
    }
    console.log(mem_password);
    const a = bcrypt.compare(mem_password, result[0].mem_password);
    console.log(a);
    if (bcrypt.compare(mem_password, result[0].mem_password)) {
      console.log(a, "-------------");
      res.status(200).json({
        message: "เรียกข้อมูลสำเร็จ",
        data: result,
        status: "success",
      });
    }
  });
});
// end api login -----------------------------------------------------------------------------------------

// API Login owner,rider
app.post("/login_rider", cors(), async (req, res) => {
  console.log(61, req.body);
  const { rider_email, rider_password } = req.body;
  let sql = "SELECT * FROM riders WHERE rider_email = ? ";
  await conn.execute(sql, [rider_email], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    console.log(177, result);
    //ตรวจสอบค่าว่า result ต้องมี length
    if (!result.length) {
      res.status(401).json({
        message: "",
        status: "fail",
      });
      return;
    }
    console.log(rider_password);
    const a = bcrypt.compare(rider_password, result[0].rider_password);
    console.log(a);
    if (bcrypt.compare(rider_password, result[0].rider_password)) {
      console.log(a, "-------------");
      res.status(200).json({
        message: "เรียกข้อมูลสำเร็จ",
        data: result,
        status: "success",
      });
    }
  });
});
// end api login -----------------------------------------------------------------------------------------

//API read single rider
app.get("/riders/:rider_id", cors(), async (req, res) => {
  const { rider_id } = req.params;
  let sql = "SELECT * FROM riders WHERE rider_id = ?";
  conn.execute(sql, [rider_id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

// API edit rider
app.put("/riders/:rider_id", cors(), async (req, res) => {
  const { rider_id } = req.params;
  const { rider_email, rider_password } = req.body;

  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(rider_password, salt, (err, hash) => {
      let sql =
        "UPDATE riders SET rider_email =?, rider_password =? WHERE rider_id =?";
      conn.execute(sql, [rider_email, hash, rider_id], (err, result) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
          return;
        }
        res.status(200).json({
          message: "แก้ไขข้อมูลสำเร็จ",
          data: result,
        });
      });
    });
  });
});

//Delete Rider
app.delete("/riders/:rider_id", cors(), async (req, res) => {
  const { rider_id } = req.params;
  console.log(req.params);
  let sql = "DELETE FROM riders WHERE rider_id = ?";
  conn.execute(sql, [rider_id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "ลบข้อมูลสำเร็จ",
    });
  });
});

// API read all Rider
app.get("/riders", cors(), async (req, res) => {
  let sql = "SELECT * FROM riders";

  await conn.execute(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

// API insert rider
app.post("/riders", cors(), upload.single("rider_image"), async (req, res) => {
  const {
    rider_email,
    rider_password,
    rider_name,
    rider_surname,
    rider_phone,
    role,
  } = req.body;
  const rider_image = req.file.filename;

  bcrypt.genSalt(saltRound, (err, salt) => {
    bcrypt.hash(rider_password, salt, (err, hash) => {
      let sql =
        "INSERT INTO riders (rider_email, rider_password, rider_name, rider_surname, rider_phone, rider_image, role) VALUES (?, ?, ?, ?, ?, ?,?)";
      conn.execute(
        sql,
        [
          rider_email,
          hash,
          rider_name,
          rider_surname,
          rider_phone,
          rider_image,
          role,
        ],
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
    });
  });
});
// END Riders -----------------------------------------------------------------------------------------------------

// API  upload image+food
app.post("/food", cors(), upload.single("food_image"), (req, res) => {
  const { food_name, food_price, food_status } = req.body;
  const food_image = req.file.filename;
  let sql =
    "INSERT INTO food (food_name, food_price, food_status, food_image) VALUES (?, ?, ?, ?)";
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
});

// read all food
app.get("/food", cors(), async (req, res) => {
  let sql = "SELECT * FROM food";
  console.log("เรียกข้อมูลสำเร็จ");
  await conn.execute(sql, [], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    result.button_status = false; //ใช้เพื่อแสดงปุ่มเปลี่ยนสถานะ
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

// read singed food
app.get("/food/:food_id", cors(), async (req, res) => {
  const { food_id } = req.params;
  console.log(req.params);
  let sql = "SELETE * FROM food WHERE food_id = ?";
  conn.execute(sql, [food_id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "ดูข้อมูลสำเร็จ",
    });
  });
});

//delete food
app.delete("/food/:food_id", cors(), async (req, res) => {
  const { food_id } = req.params;
  console.log(req.params);
  let sql = "DELETE FROM food WHERE food_id = ?";
  conn.execute(sql, [food_id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "ลบข้อมูลสำเร็จ",
    });
  });
});

// API change ststus_food
app.put("/food/:food_id", async (req, res) => {
  console.log(req.body);
  const { food_id, status } = req.body;

  let sql = "UPDATE food SET food_status =? WHERE food_id =?";
  conn.execute(sql, [status, food_id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "แก้ไขข้อมูลสำเร็จ",
      data: result,
    });
  });
});


// end API food --------

app.post("/getOrderMember", async (req, res) => {
  if (req.body) {
    const order = req.body;

    const sql = `
    SELECT * FROM member_orders 
    JOIN members
    ON members.mem_id = member_orders.order_mem_id
    WHERE order_mem_id = ? and status = ?`;
    await conn.execute(sql, [order.mem_id, order.status], (err, result) => {
      if (err) {
        conn.rollback();
        res.status(500).json({
          message: err.message,
          statusCode: 500,
        });
        return;
      }
      res.status(201).json({
        statusCode: 200,
        message: "เรียกข้อมูลสำเร็จ",
        data: result,
      });
    });
  }
});

app.post("/saveOrderMember", (req, res) => {
  if (req.body) {
    const order = req.body;
    const sql = `INSERT INTO member_orders (
          order_mem_id,
          order_id,
          mem_order_data,
          status
      ) VALUES (
          ?, ?, ?, ?
      )`;
    conn.execute(
      sql,
      [order.products[0].mem_id, null, JSON.stringify(order), order.status],
      (err, result) => {
        if (err) {
          conn.rollback();
          res.status(500).json({
            message: err.message,
            statusCode: 500,
          });
          return;
        }
        console.log(result);
        res.status(201).json({
          message: "เพิ่มข้อมูลสำเร็จ",
          data: result,
          statusCode: 200,
        });
      }
    );
  }
});

app.post("/selectOrder/:status", async (req, res)=>{
  const status = req.params.status;
  const sql = `SELECT * FROM orders WHERE status = ?`

  await conn.execute(sql,[status],(err, result) =>{
    if (err){
      conn.rollback()
      res.status(500).json({
        message : err.message,
        statusCode : 500
      })
      return
    }
    res.status(201).json({
      message : "เพิ่มข้อมูลสำเร็จ",
      data : result,
      statusCode : 200
    })
  })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
