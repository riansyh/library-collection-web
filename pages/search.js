import { useState, useEffect } from "react";
const d3 = require("d3-sparql");

function search({ keyword, data }) {
    return (
        <div>
            {keyword}

            {data.map((d) => (
                <h2 className="mt-3">{d.judul_koleksi}</h2>
            ))}
        </div>
    );
}

export async function getServerSideProps({ query }) {
    const keyword = query.keyword ? query.keyword : "";

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

    const queryRdf = keyword === "" ? queryAll : querySearch;

    const data = await d3.sparql(rdfUrl, queryRdf);

    return {
        props: {
            keyword,
            data,
        }, // will be passed to the page component as props
    };
}

export default search;
