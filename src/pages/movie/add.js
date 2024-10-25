import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

function Add() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for the uploaded image

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
    console.log(title, publishingYear);

    // Check if an image file is uploaded
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    // Create FormData to upload the image
    const formData = new FormData();
    formData.append("file", imageFile); // Append the image file

    // Upload the image
    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error("Error uploading image:", await uploadResponse.text());
      alert("Error uploading image.");
      return;
    }

    const jsonRes = await uploadResponse.json(); // Assuming your upload API returns the image URL
    console.log(uploadResponse);
    let url = jsonRes.data[0].Location;
    console.log(url);

    let data = {
      title,
      publishingYear,
      poster: url, // Use the uploaded image URL
    };

    // Create movie with uploaded image URL
    const response = await fetch("/api/movies/add", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Movie added successfully");
      setTimeout(() => {
        router.push("/movie");
      }, 1000);
    } else {
      console.error("Error adding movie:", await response.text());
      alert("Error adding movie.");
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    console.log("drag over");
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // Get the first file
    if (file && file.type.startsWith("image/")) {
      setImageFile(file); // Set the file in state
      console.log("File dropped:", file.name);
    } else {
      alert("Please drop a valid image file.");
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  return (
    <div className="px-8 pb-8 flex flex-col justify-between items-start">
      <div className="flex justify-center w-full">
        <h2 className="text-white text-5xl font-semibold mb-6 items-center text-center">
          Create a new movie
        </h2>
      </div>
      <div className="flex space-x-6 items-center py-8">
        <div
          className="w-[400px] h-[400px] border-2 border-dashed border-gray-400 flex flex-col justify-center items-center rounded-lg hover:bg-gray-700 hover:cursor-pointer hover:border-green-500 hover:border-dotted"
          onDragOver={handleDragOver} 
          onDrop={handleDrop}
          onClick={() => {
            const fileInput = document.getElementById("fileInput");
            if (fileInput) {
              fileInput.click();
            } else {
              console.error("File input element not found");
            }
          }}
        >
          {imageFile ? (
            <Image
              src={URL.createObjectURL(imageFile)} // Preview the uploaded image
              width={400}
              height={400}
              alt="uploaded image"
              className="mb-3"
            />
          ) : (
            <Image
              src="/assets/file_download.png"
              width={16}
              height={16}
              alt="file_download"
              className="mb-3"
            />
          )}
          <p className="text-gray-300">Drop an image here</p>
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="flex flex-col w-[400px] space-y-6 align-top">
          <div>
            <label htmlFor="title" className="block mb-2 text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="year" className="block mb-2 text-gray-300">
              Publishing year
            </label>
            <input
              type="text"
              id="year"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={publishingYear}
              onChange={(e) => setPublishingYear(e.target.value)}
            />
          </div>

          <div className="flex space-x-4 justify-between">
            <button
              className="w-[120px] bg-transparent border border-gray-300 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={() => router.push("/movie")}
            >
              Cancel
            </button>
            <button
              className="w-[120px] bg-[#2BD17E] text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add;
