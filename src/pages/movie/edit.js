import toastr from "@/lib/toastr";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function Edit() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null); // State for existing image URL
  const [errors, setErrors] = useState({}); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading

  async function fetchMovieDetails(id) {
    try {
      const response = await fetch(`/api/movies/getOne?id=${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  }

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      fetchMovieDetails(id).then((movie) => {
        if (movie) {
          setTitle(movie.title);
          setPublishingYear(movie.publishingYear);
          setExistingImage(movie.poster); // Set existing image URL
        }
      });
    }
  }, [router.query]);

  function validateForm() {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    if (!publishingYear) newErrors.year = "Publishing year is required.";
    else if (!/^\d{4}$/.test(publishingYear)) 
      newErrors.year = "Publishing year must be a 4-digit number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    setLoading(true);
    let imageUrl = existingImage;

    // Upload the new image if it exists
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const jsonRes = await uploadResponse.json();
        imageUrl = jsonRes.data[0].Location;
      } else {
        alert("Error uploading image.");
        setLoading(false);
        return;
      }
    }

    const { id } = router.query;
    const data = {
      id,
      title,
      publishingYear,
      poster: imageUrl,
    };

    const response = await fetch(`/api/movies/edit?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    
    if (response.ok) {
      toastr.success("Movie updated successfully");
      setTimeout(() => {
        router.push("/movie");
      }, 1000);
    } else {
      toastr.error("Error updating movie.");
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
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
        <h2 className="text-white text-5xl font-semibold mb-6 text-center">
          Edit movie
        </h2>
      </div>
      <div className="flex space-x-6 items-start py-8">
        <div
          className="w-[400px] h-[400px] border-2 border-dashed border-gray-400 flex flex-col justify-center items-center rounded-lg hover:bg-gray-700 cursor-pointer hover:border-green-500 hover:border-dotted"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            const fileInput = document.getElementById("fileInput");
            if (fileInput) fileInput.click();
          }}
        >
          {imageFile ? (
            <Image
              src={URL.createObjectURL(imageFile)}
              width={400}
              height={400}
              alt="uploaded image"
              className=""
            />
          ) : existingImage ? (
            <Image
              src={existingImage}
              width={400}
              height={400}
              alt="existing image"
              className="mb-0"
            />
          ) : (
            <Image
              src="/assets/file_download.png"
              width={16}
              height={16}
              alt="file download"
              className="mb-0"
            />
          )}
          <p className="text-gray-300 ">Drop an image here or click to upload</p>
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="flex flex-col w-[400px] space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.title ? "border-2 border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) validateForm(); // Validate on input change
              }}
            />
            {errors.title && <p className="mt-2 text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="year" className="block mb-2 text-gray-300">
              Publishing year
            </label>
            <input
              type="text"
              id="year"
              className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.year ? "border-2 border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
              value={publishingYear}
              onChange={(e) => {
                setPublishingYear(e.target.value);
                if (errors.year) validateForm(); // Validate on input change
              }}
            />
            {errors.year && <p className="mt-2 text-red-500">{errors.year}</p>}
          </div>

          <div className="flex space-x-4 justify-between">
            <button
              className="w-[120px] bg-transparent border border-gray-300 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={() => router.push("/movie")}
            >
              Cancel
            </button>
            <button
              className={`w-[120px] ${loading ? "bg-gray-600" : "bg-[#2BD17E]"} text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500`}
              onClick={handleSubmit}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
