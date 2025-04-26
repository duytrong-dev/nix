'use client';
import React, { useState, useEffect } from "react";

interface Room {
  id: number;
  name_of_client: string;
  phone: string;
  start_date: string;
  payment_id: number;
  note: string;
  payment_name: string; 
  checked: boolean;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal xác nhận xóa
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name_of_client: "",
    phone: "",
    start_date: "",
    payment_id: 1, // Mặc định là "Theo tháng"
    note: "",
  });

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/hotels");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        const mappedRooms = data.map((room: any) => ({
          id: room.id,
          name_of_client: room.name_of_client,
          phone: room.phone,
          start_date: room.start_date,
          payment_id: room.payment_id,
          note: room.note,
          payment_name: room.payment?.name || "N/A",
          checked: false,
        }));
        setRooms(mappedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    // Kiểm tra tên khách hàng
    const nameRegex = /^[a-zA-Z\s]{5,50}$/; // Chỉ chứa chữ cái và khoảng trắng, độ dài từ 5 đến 50
    if (!nameRegex.test(newRoom.name_of_client || "")) {
      alert("Tên khách hàng phải từ 5 đến 50 ký tự và không chứa số hoặc ký tự đặc biệt!");
      return;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10}$/; // Chỉ chứa 10 chữ số
    if (!phoneRegex.test(newRoom.phone || "")) {
      alert("Số điện thoại phải là số có 10 chữ số!");
      return;
    }

    // Kiểm tra ngày bắt đầu thuê
    const today = new Date();
    const startDate = new Date(newRoom.start_date || "");
    if (startDate < today) {
      alert("Ngày bắt đầu thuê không được là ngày trong quá khứ!");
      return;
    }

    // Kiểm tra hình thức thanh toán
    if (!newRoom.payment_id || newRoom.payment_id === 0) {
      alert("Vui lòng chọn hình thức thanh toán!");
      return;
    }

    // Nếu tất cả kiểm tra hợp lệ, tiếp tục gửi dữ liệu
    const roomData = {
      name_of_client: newRoom.name_of_client,
      phone: newRoom.phone,
      start_date: newRoom.start_date,
      payment_id: newRoom.payment_id, // Gửi payment_id
      note: newRoom.note || "",
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const createdRoom = await response.json();

      // Cập nhật danh sách phòng trọ sau khi tạo thành công
      setRooms([...rooms, { ...createdRoom, checked: false }]);
      setIsModalOpen(false);
      setNewRoom({
        name_of_client: "",
        phone: "",
        start_date: "",
        payment_id: 1, // Mặc định là "Theo tháng"
        note: "",
      });
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Có lỗi xảy ra khi tạo phòng trọ!");
    }
  };

  const handleDeleteSelected = async () => {
    // Lấy danh sách các ID đã được chọn
    const selectedIds = rooms.filter((room) => room.checked).map((room) => room.id);

    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng để xóa!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/hotels/multiple", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete rooms");
      }

      // Cập nhật danh sách phòng trọ sau khi xóa thành công
      const remainingRooms = rooms.filter((room) => !room.checked);
      setRooms(remainingRooms);
      alert("Xóa thành công!");
      setIsConfirmModalOpen(false); // Đóng modal xác nhận
    } catch (error) {
      console.error("Error deleting rooms:", error);
      alert("Có lỗi xảy ra khi xóa phòng trọ!");
    }
  };

  const handleCheck = (id: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === id ? { ...room, checked: !room.checked } : room
      )
    );
  };

  const filteredRooms = rooms.filter((room) => {
    const searchLower = search.toLowerCase();
    return (
      (room.name_of_client &&
        room.name_of_client.toLowerCase().includes(searchLower)) ||
      (room.phone && room.phone.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Danh sách phòng trọ</h1>
      <div className="mb-5 flex items-center gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm tên khách hàng hoặc số điện thoại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tạo mới
        </button>
        <button
          onClick={() => setIsConfirmModalOpen(true)} // Mở modal xác nhận
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">STT</th>
            <th className="border border-gray-300 px-4 py-2">Tên khách hàng</th>
            <th className="border border-gray-300 px-4 py-2">Số điện thoại</th>
            <th className="border border-gray-300 px-4 py-2">Ngày bắt đầu</th>
            <th className="border border-gray-300 px-4 py-2">Hình thức thanh toán</th>
            <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
            <th className="border border-gray-300 px-4 py-2">Checked</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room, index) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{room.name_of_client}</td>
              <td className="border border-gray-300 px-4 py-2">{room.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{room.start_date}</td>
              <td className="border border-gray-300 px-4 py-2">{room.payment_name}</td>
              <td className="border border-gray-300 px-4 py-2">{room.note}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={room.checked}
                  onChange={() => handleCheck(room.id)}
                  className="cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal tạo mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Tạo mới phòng trọ</h2>
            <div className="mb-3">
              <label className="block mb-1">Tên khách hàng:</label>
              <input
                type="text"
                value={newRoom.name_of_client}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name_of_client: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Số điện thoại:</label>
              <input
                type="text"
                value={newRoom.phone}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, phone: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Ngày bắt đầu:</label>
              <input
                type="date"
                value={newRoom.start_date}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, start_date: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Hình thức thanh toán:</label>
              <select
                value={newRoom.payment_id}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, payment_id: Number(e.target.value) })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="1">Theo tháng</option>
                <option value="2">Theo quý</option>
                <option value="3">Theo năm</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1">Ghi chú:</label>
              <textarea
                value={newRoom.note}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, note: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateRoom}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa các phòng đã chọn không?</p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
