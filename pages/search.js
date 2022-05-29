import { useState, useEffect } from "react";
const d3 = require("d3-sparql");
import Image from "next/image";
import { useRouter } from "next/router";
import Card from "../Components/Card";

function Search({ keyword, data }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(keyword);
    const [detailData, setDetailData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const Router = useRouter();

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        Router.push({ pathname: "/search", query: { keyword: searchKeyword } });
    };

    const handleClick = (data) => {
        setDetailData(data);
    };

    return (
        <section className="relative">
            <header className="sticky top-0 py-10 bg-grey-0">
                <div className="container mx-auto flex items-center justify-center flex-col">
                    <h1 className="text-3xl font-bold">Koleksi Jurnal dan Skripsi</h1>
                    <form className="flex gap-4 w-full" onSubmit={handleSearch}>
                        <div className="input overflow-hidden rounded-lg cursor-pointer p-0 mt-6 flex-[1]">
                            <select className="w-full h-full outline-none border-0 cursor-pointer input"></select>
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="input mt-6 rounded-lg flex-[3]"
                            value={searchKeyword}
                            placeholder="Masukkan kata kunci"
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>

                {/* <div className="bg absolute bottom-6 w-screen z-[3] flex justify-center">
                    <p className="bg-grey-0 text-xs py-2 px-4 rounded-full text-grey-3 font-semibold tracking-widest">
                        © 2022 RIAN FEBRIANSYAH
                    </p>
                </div> */}
            </header>
            <main className="container mx-auto py-6 min-h-[61vh]">
                {data.length > 0 ? (
                    keyword == "" ? (
                        <h2 className="font-normal text-lg text-blue-semidark text-center">
                            Menampilkan semua koleksi
                        </h2>
                    ) : (
                        <h2 className="font-normal text-lg text-blue-semidark text-center">
                            Menampilkan hasil pencarian untuk "
                            <span className="font-semibold">{Router.query.keyword}</span>"
                        </h2>
                    )
                ) : (
                    <h2 className="font-normal text-lg text-blue-semidark text-center">
                        Tidak dapat menemukan koleksi jurnal/skripsi untuk "
                        <span className="font-semibold">{Router.query.keyword}</span>"
                    </h2>
                )}

                <section className="card-container grid grid-cols-3 gap-x-3 gap-y-5 mt-6">
                    {data.map((article, index) => (
                        <Card
                            key={`article-${index}`}
                            onClick={() => handleClick(article)}
                            tag={article.jenis}
                            author={article.nama_penulis}
                            title={article.judul_koleksi}
                        ></Card>
                    ))}
                </section>
            </main>
            <footer className="w-full py-5 flex justify-center bg-blue-semidark">
                <p className=" text-xs py-1 px-4 rounded-full text-white font-semibold tracking-widest">
                    © 2022 RIAN FEBRIANSYAH
                </p>
            </footer>
        </section>
    );
}

export async function getServerSideProps({ query }) {
    const keyword = query.keyword ? query.keyword : "";

    const rdfUrl = "http://localhost:3030/library-collections/query";

    const queryRdf = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX d:  <http://www.semanticweb.org/user/ontologies/2022/4/library#> 
        PREFIX person: <http://learningsparql.com/ns/person#> 
    
        SELECT ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit (GROUP_CONCAT(?np; separator=", ") AS ?nama_penulis) ?bidang
        WHERE { ?perpus rdf:type ?Koleksi.
            ${keyword == "" ? "" : "?perpus ?p ?o."}
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
            ${keyword == "" ? "" : `FILTER (regex(str(?o), "${keyword}", "i"))`}}
        GROUP BY ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit ?nama_penulis ?bidang ${
            keyword == "" ? "" : "?o"
        }
`;

    const data = await d3.sparql(rdfUrl, queryRdf);

    return {
        props: {
            keyword,
            data,
        }, // will be passed to the page component as props
    };
}

export default Search;
