import { useState, useEffect } from "react";
const d3 = require("d3-sparql");
import { useRouter } from "next/router";
import Card from "../Components/Card";
import Modal from "../Components/Modal";
import { BiSearchAlt, BiXCircle, BiBookContent } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import LoadingState from "../Components/LoadingState";

function Search({ keyword, data }) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(keyword);
    const [detailData, setDetailData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState("all");

    const Router = useRouter();

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };
    const handleSelectChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSearch = (e) => {
        setIsLoading(true);
        e.preventDefault();
        Router.push({ pathname: "/search", query: { type: category, keyword: searchKeyword } });
        setIsLoading(false);
    };

    const handleClick = (data) => {
        setDetailData(data);
        setShowModal(true);
    };

    return (
        <section className="relative">
            <header className="sticky top-0 py-10 bg-grey-0">
                <div className="container mx-auto flex items-center justify-center flex-col">
                    <h1 className="text-3xl font-bold">Koleksi Jurnal dan Skripsi</h1>
                    <form className="flex gap-4 w-full mt-6" onSubmit={handleSearch}>
                        <div className="flex-[1]">
                            <p className="text-base">Cari berdasarkan</p>
                            <div className="input overflow-hidden rounded-lg cursor-pointer p-0">
                                <select
                                    className="w-full h-full outline-none border-0 cursor-pointer input"
                                    onChange={handleSelectChange}
                                >
                                    <option value="all">Tidak ada</option>
                                    <option value="bidang">Bidang</option>
                                    <option value="jenis">Jenis</option>
                                    <option value="penulis">Penulis</option>
                                    <option value="penerbit">Penerbit</option>
                                    <option value="tahun_terbit">Tahun terbit</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-[3] relative">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="input mt-6 rounded-lg w-full"
                                value={searchKeyword}
                                placeholder="Masukkan kata kunci"
                                onChange={handleSearchChange}
                            />
                            <div
                                className="absolute bottom-[16px] right-4 cursor-pointer"
                                onClick={handleSearch}
                            >
                                <AiOutlineSearch size={20} />
                            </div>
                        </div>
                    </form>
                </div>
            </header>
            <main className="container mx-auto py-6 min-h-[61vh] flex flex-col items-center">
                {isLoading && <LoadingState />}
                {data.length > 0 ? (
                    keyword == "" ? (
                        <div className="flex gap-2 items-center">
                            <BiBookContent size={24} className="text-blue-semidark" />
                            <h2 className="font-normal text-lg text-blue-semidark text-center">
                                Menampilkan semua koleksi
                            </h2>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <BiSearchAlt size={24} className="text-blue-semidark" />
                            <h2 className="font-normal text-lg text-blue-semidark text-center">
                                Menampilkan hasil pencarian untuk &quot;
                                <span className="font-semibold">{Router.query.keyword}</span>&quot;
                            </h2>
                        </div>
                    )
                ) : (
                    <div className="flex gap-2 items-center">
                        <BiXCircle size={24} className="text-blue-semidark" />

                        <h2 className="font-normal text-lg text-blue-semidark text-center">
                            Tidak dapat menemukan koleksi jurnal/skripsi untuk &quot;
                            <span className="font-semibold">{Router.query.keyword}</span>&quot;
                        </h2>
                    </div>
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

            {showModal && <Modal data={detailData} handleClose={() => setShowModal(false)} />}
        </section>
    );
}

const getQuery = (word) => {
    let query;
    switch (word) {
        case "all":
            query = "o";
            break;
        case "bidang":
            query = "bidang";
            break;
        case "jenis":
            query = "jenis";
            break;
        case "penulis":
            query = "np";
            break;
        case "penerbit":
            query = "penerbit";
            break;
        case "tahun_terbit":
            query = "tahun_terbit";
            break;
        default:
            query = "o";
            break;
    }
    return query;
};

export async function getServerSideProps({ query }) {
    const keyword = query.keyword ? query.keyword : "";
    const type = query.type ? getQuery(query.type) : "o";

    console.log(process.env.SPARQL_URL)

    const rdfUrl = process.env.SPARQL_URL;

    const queryRdf = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX d:  <http://www.semanticweb.org/user/ontologies/2022/4/library#> 
        PREFIX person: <http://learningsparql.com/ns/person#> 
    
        SELECT ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit (GROUP_CONCAT(?np; separator=", ") AS ?nama_penulis) ?bidang
        WHERE { ?perpus rdf:type ?Koleksi.
            ${keyword == "" ? "" : type == "o" ? "?perpus ?p ?o." : ""}
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
            ${keyword == "" ? "" : `FILTER (regex(str(?${type}), "${keyword}", "i"))`}}
        GROUP BY ?judul_koleksi ?jenis ?halaman ?bahasa ?tahun_terbit ?link ?penerbit ?nama_penulis ?bidang 
        ${keyword == "" ? "" : type == "o" ? "?o" : ""}
`;

    const data = await d3.sparql(rdfUrl, queryRdf);

    return {
        props: {
            keyword,
            data,
        },
    };
}

export default Search;
