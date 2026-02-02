import { FaTimes } from "react-icons/fa";

export default function EditBookModal({ book, close, handleUpdate, setBook }) {
  if (!book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(book);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white text-black p-8 rounded-xl w-[400px] relative shadow-xl">

        {/* Close Button */}
        <button 
          onClick={close}
          className="absolute top-4 right-4 text-xl hover:text-red-500"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Book</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Book Name"
            value={book["Book-Name"]}
            onChange={(e) =>
              setBook({ ...book, "Book-Name": e.target.value })
            }
            className="w-full p-3 border rounded mb-4"
          />

          <input
            type="text"
            placeholder="Publisher"
            value={book["Publisher"]}
            onChange={(e) =>
              setBook({ ...book, "Publisher": e.target.value })
            }
            className="w-full p-3 border rounded mb-4"
          />

          <input
            type="text"
            placeholder="Category"
            value={book["Book-category"]}
            onChange={(e) =>
              setBook({ ...book, "Book-category": e.target.value })
            }
            className="w-full p-3 border rounded mb-4"
          />

          <input
            type="number"
            placeholder="Stock"
            value={book.Stock}
            onChange={(e) =>
              setBook({ ...book, Stock: Number(e.target.value) })
            }
            className="w-full p-3 border rounded mb-4"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
}
