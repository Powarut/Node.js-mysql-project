const express = require('express')
const order = express()
const { conn } = require("../database/connection")

var cors = require('cors')
order.use('/food_images', express.static('./images'))
order.use('/rider_images', express.static('./images'))

order.use(
  cors({
      origin: '*',
      credentials: true,
  }),
);
order.use(express.json())
order.use(express.urlencoded({extended: true}))


async function postOrderMember(req, res) {
    if (req.body) {
        const order = req.body
        console.log(order)
        const sql = `INSERT INTO member_orders (
            order_mem_id,
            order_id,
            mem_order_data,
            status
        ) VALUES (
            ?, ?, ?, ?
        )`
        await conn.execute(
            sql,
            [
                order.products[0].mem_id,
                null,
                JSON.stringify(order),
                order.status
            ],
            (err, result) => {
                if(err) {
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
                  statusCode: 200
                })
            }
        )
    }
}

async function getOrderMember(req, res) {
  if (req.body) {
    const order = req.body;

    const sql = `
    SELECT * FROM member_orders 
    JOIN members
    ON members.mem_id = member_orders.order_mem_id
    WHERE order_mem_id = ? and status = ?`;

    const query = await conn.execute(
      sql,
      [order.mem_id, order.status],
      (err, result) => {
        if (err) {
          conn.rollback()
          res.status(500).json({
            message: err.message,
            statusCode: 500,
          });
          return
        }
        res.status(201).json({
          statusCode: 200,
          message: "เรียกข้อมูลสำเร็จ",
          data: result,
        });
      }
    );
  }
}

order.post("/orderMember", postOrderMember);
order.post("/getOrderMember", getOrderMember);

module.exports = { order };