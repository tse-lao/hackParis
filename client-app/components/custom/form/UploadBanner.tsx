"use client"

import Image from "next/image";
import { useState } from "react";

export default function UploadBanner() {
  const [image, setImage] = useState("");
  
  const handleImageChange = (e:any) => {
    if (e.target.files && e.target.files[0]) {
      let img = URL.createObjectURL(e.target.files[0]);
      setImage(img);
    }
  };
  
  
  if(image){
    return (

        <div className="space-y-1 text-center hover:bg-white hover:opacity-50" onClick={(e) => {e.preventDefault();setImage("")}}>
          <Image src={image} alt="banner_upload"
            width={500}
            height={100}
            sizes="(max-height: 200px) 100vw"
          />
      </div>
    )
  }
  return (
    <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 w-[600px]">
    <div className="space-y-1 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex text-sm text-gray-600">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
        >
          <span>Upload a file</span>
          <input id="file-upload" name="file-upload" type="file" accept="images/png, images/jpg, images/gif" className="sr-only"  onChange={handleImageChange}/>
        </label>
        <p className="pl-1">or add ipfs link</p>
      </div>
      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
    </div>
  </div>

  )
}
