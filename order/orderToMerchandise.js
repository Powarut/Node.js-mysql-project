const express = require('express')
const order = express()
const multer = require('multer')
const { upload } = require('../maddlewave')
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
                order[0].mem_id,
                null,
                JSON.stringify(order),
                0
            ],
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
            }
        )
    }
}


order.post("/orderMember", postOrderMember);

module.exports = { order }