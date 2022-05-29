import { useState, useEffect } from "react";
const d3 = require("d3-sparql");
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home({}) {
    const [keyword, setKeyword] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter();

    const getData = (keyword) => {
        setIsLoading(true);
        const rdfUrl = "http://localhost:3030/ds/query";

        const queryAll = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX d:  <http://www.semanticweb.org/user/ontologies/2022/4/library#> 
        PREFIX person: <http://learningsparql.com/ns/person#> 
    
        SELECT ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit (GROUP_CONCAT(?np; separator=", ") AS ?nama_penulis) ?bidang
        WHERE { ?perpus rdf:type ?Koleksi.
            ?perpus d:judul ?judul_koleksi.
            ?perpus d:jenis ?jenis.
            ?perpus d:tahun_terbit ?tahun_terbit.
            ?perpus d:halaman ?halaman.
            ?perpus d:bahasa ?bahasa.
            ?perpus d:link ?link.
            ?perpus d:ditulis ?Penulis.
            ?perpus d:koleksi_dari ?Jurusan.
            ?perpus d:diterbitkan ?Penerbit.
            ?Penerbit d:nama ?penerbit.
            ?Penulis d:nama ?np.
            ?Jurusan d:nama ?bidang.}
        GROUP BY ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit ?nama_penulis ?bidang
`;

        const querySearch = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX d:  <http://www.semanticweb.org/user/ontologies/2022/4/library#> 
            PREFIX person: <http://learningsparql.com/ns/person#> 
        
            SELECT ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit (GROUP_CONCAT(?np; separator=", ") AS ?nama_penulis) ?bidang
            WHERE { ?perpus rdf:type ?Koleksi.
                ?perpus ?p ?o.
                ?perpus d:judul ?judul_koleksi.
                ?perpus d:jenis ?jenis.
                ?perpus d:tahun_terbit ?tahun_terbit.
                ?perpus d:halaman ?halaman.
                ?perpus d:bahasa ?bahasa.
                ?perpus d:link ?link.
                ?perpus d:ditulis ?Penulis.
                ?perpus d:koleksi_dari ?Jurusan.
                ?perpus d:diterbitkan ?Penerbit.
                ?Penerbit d:nama ?penerbit.
                ?Penulis d:nama ?np.
                ?Jurusan d:nama ?bidang
                FILTER (regex(str(?o), "${keyword}", "i"))}
            GROUP BY ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit ?nama_penulis ?bidang ?o
    `;

        const query = keyword === "" ? queryAll : querySearch;

        d3.sparql(rdfUrl, query).then((data) => {
            setData(data);
            setIsLoading(false);
        });
    };

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // getData(keyword);
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
                            className="w-[460px] mt-6 border-[1px] border-grey-1 outline-none px-4 py-3 rounded-full"
                            value={keyword}
                            onChange={handleSearchChange}
                        />
                    </form>

                    <section>
                        <h2 className="my-6">Hasil Pencarian</h2>

                        {isLoading && <p>Loading...</p>}

                        {data.map((d) => (
                            <h2 className="mt-3">{d.judul_koleksi}</h2>
                        ))}
                    </section>
                </div>

                <div className="absolute bottom-0 z-[2] flex items-center justify-center w-screen">
                    <Image src="/pic.png" width={735} height={362}></Image>
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
