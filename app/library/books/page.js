"use client";

import Loader from "@/app/Components/Loader";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import EditBookModal from "@/app/Components/EditBookModal";
import DownloadReportButton from "@/app/Components/DownloadReportButton";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/bookdetails");

        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);


  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookdetails");

      if (!res.ok) throw new Error("Failed to fetch books");

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleUpdate = async (book) => {
    try {
      const response = await fetch(`/api/bookdetails?id=${book["Book-Id"]}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Book updated!");
        setShowModal(false);
        fetchBooks();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async (book) => {
    try {
      const response = await fetch(`/api/bookdetails?id=${book["Book-Id"]}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Book deleted succesfully");
        fetchBooks();
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-10 text-white bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      <h1 className="text-4xl font-bold mb-8 drop-shadow-md">
        📚 Books Management
      </h1>

      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Books List</h2>
          <DownloadReportButton
            apiEndpoint="/api/bookdetails"
            fileName="Books_Report"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/20">
          <table className="min-w-full bg-white/10 backdrop-blur-md">
            <thead className="bg-white/20">
              <tr className="uppercase text-sm tracking-wider text-gray-200">
                <th className="py-4 px-6 text-left">Book ID</th>
                <th className="py-4 px-6 text-left">Book Name</th>
                <th className="py-4 px-6 text-left">Publisher</th>
                <th className="py-4 px-6 text-left">Category</th>
                <th className="py-4 px-6 text-left">Stock</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr
                  key={book["Book-Id"]}
                  className={`transition-all ${index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                    } hover:bg-white/20`}
                >
                  <td className="py-4 px-6">{book["Book-Id"]}</td>
                  <td className="py-4 px-6">{book["Book-Name"]}</td>
                  <td className="py-4 px-6">{book["Publisher"]}</td>
                  <td className="py-4 px-6 capitalize">
                    {book["Book-category"]}
                  </td>
                  <td
                    className={`py-4 px-6 font-semibold ${book.Stock <= 2 ? "text-red-400" : "text-green-300"
                      }`}
                  >
                    {book.Stock}
                  </td>
                  <td className="py-4 px-6 flex gap-4">
                    <button
                      className="text-blue-400 hover:text-blue-500 text-xl"
                      onClick={() => handleEdit(book)}
                      title="Update"
                    >
                      <FiEdit />
                    </button>

                    <button
                      className="text-red-400 hover:text-red-500 text-xl"
                      title="Delete"
                      onClick={() => handleDelete(book)}
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (inside return!) */}
      {showModal && selectedBook && (
        <EditBookModal
          book={selectedBook}
          setBook={setSelectedBook}
          close={() => setShowModal(false)}
          handleUpdate={handleUpdate}
        />
      )}

    </div>
  );
}
