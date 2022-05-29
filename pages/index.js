import { useState, useEffect } from "react";
const d3 = require("d3-sparql");
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home({}) {
    const [keyword, setKeyword] = useState("");
    const Router = useRouter();

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        Router.push({ pathname: "/search", query: { keyword: keyword } });
    };

    return (
        <>
            <main className="min-h-screen relative">
                <div className="container mx-auto flex items-center justify-center flex-col py-20">
                    <h1 className="text-6xl font-bold">Koleksi Jurnal dan Skripsi</h1>
                    <p className="text-base text-grey-3 mt-6 max-w-[760px] text-center">
                        Temukan jurnal dan skripsi yang bisa digunakan sebagai referensi untuk tugas
                        akhir, makalah, maupun karya tulis ilmiah lainnya dengan mudah sekarang
                    </p>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="input mt-6 rounded-full w-[460px]"
                            value={keyword}
                            onChange={handleSearchChange}
                            placeholder="Masukkan kata kunci"
                        />
                    </form>
                </div>

                <div className="absolute bottom-0 z-[2] flex items-center justify-center w-screen">
                    <Image alt="Journal example" src="/pic.png" width={735} height={362}></Image>
                </div>
                <div className="bg absolute bottom-0 w-screen bg-blue-light h-[120px] z-[1]"></div>
                <div className="bg absolute bottom-6 w-screen z-[3] flex justify-center">
                    <p className="bg-grey-0 text-xs py-2 px-4 rounded-full text-grey-3 font-semibold tracking-widest">
                        © 2022 RIAN FEBRIANSYAH
                    </p>
                </div>
            </main>
        </>
    );
}
