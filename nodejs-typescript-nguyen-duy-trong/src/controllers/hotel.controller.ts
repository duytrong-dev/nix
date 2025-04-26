import e, { Request, Response } from "express";
import { Hotel } from "~/models/hotel.model.js";
import { Payment } from "~/models/payment.model.js";

export const getAllHotels = async (req: Request, res: Response) => {
    try {
      const hotels = await Hotel.findAll({ include: [Payment] });
      res.status(200).json(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export const getHotelById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const hotel = await Hotel.findOne({ where: { id }, include: [Payment] });
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
      res.status(200).json(hotel);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export const createHotel = async (req: Request, res: Response) => {
    try {
      const newHotel = await Hotel.create(req.body);
      res.status(201).json(newHotel);
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(400).json({ message: 'Failed to create hotel', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export const updateHotel = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const [updated] = await Hotel.update(req.body, { where: { id } });
      if (!updated) return res.status(404).json({ message: 'Hotel not found' });
      const updatedHotel = await Hotel.findOne({ where: { id }, include: [Payment] });
      res.status(200).json(updatedHotel);
    } catch (error) {
      console.error('Error updating hotel:', error);
      res.status(400).json({ message: 'Failed to update hotel', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export const deleteHotel = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await Hotel.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: 'Hotel not found' });
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}

export const deleteMultipleHotels = async (req: Request, res: Response)=> {
  try {
      const ids: number[] = req.body.ids;
      if (!Array.isArray(ids) || ids.length === 0) {
          res.status(400).json({ message: 'Invalid or empty IDs array' });
      }

      const deletedCount = await Hotel.destroy({
          where: {
              id: ids
          }
      });

      if (deletedCount === 0) {
          res.status(404).json({ message: 'No hotels found to delete' });
      }

      res.status(200).json({ message: `${deletedCount} hotels deleted successfully` });
  } catch (error) {
      console.error('Error deleting multiple hotels:', error);
      res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
