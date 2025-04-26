import { Router } from "express";
import { createHotel, deleteMultipleHotels, getAllHotels } from "~/controllers/hotel.controller.js";

const hotelRouter = Router();

// Lấy danh sách tất cả hotel
hotelRouter.get('/', getAllHotels);


// Tạo hotel mới
hotelRouter.post('/', createHotel);

hotelRouter.delete('/multiple', deleteMultipleHotels);
// Xoá hotel theo ID
// hotelRouter.delete('/:id', deleteHotel);

export default hotelRouter;