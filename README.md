<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/riansyh/library-collection-web">
    <img src="public/img/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Library Collection Web</h3>

  <p align="center">
    Platform pencari koleksi jurnal dan skripsi berdasarkan judul, tahun terbit, penulis, bidang, bahasa, dan penerbit.
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#our-team">Created by</a>
    </li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-the-project">Running the Project</a></li>
      </ul>
    </li>
  </ol>
</details>

## Created by

| NPM          | Name                      |
| ------------ | ------------------------- |
| 140810190026 | Rian Febriansyah          |

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Web Screen Shot][preview-1]](https://github.com/riansyh/library-collection-web)
[![Web Screen Shot][preview-2]](https://github.com/riansyh/library-collection-web)
[![Web Screen Shot][preview-3]](https://github.com/riansyh/library-collection-web)

This repository is a final project from Semantic Web Class, Teknik Informatika, Universitas Padjadjaran.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

-   [Next.js](https://nextjs.org/)
-   [d3-sparql](https://github.com/zazuko/d3-sparql)
-   [Tailwind CSS](https://tailwindcss.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This project uses Next Js and Jena Fuseki as a serve which needs the following to run properly:

-   Git
-   Node Js
-   npm
-   Apache Jena Fuseki

### Installation

1. Clone the repo
    ```sh
     git clone https://github.com/riansyh/library-collection-web.git
    ```
2. Install NPM packages
    ```sh
     npm install
    ```
3. Run Development server
    ```sh
     npm run dev
    ```

### Running the Project

1. Start fuseki server with database name is "library-collections"

2. Then access the fuseki server in localhost url at port 8000 by visiting [localhost:8000](http://localhost:8000) or [127.0.0.1:8000](http://127.0.0.1:8000) and add the perpustakaan.ttl as a dataset

3. Run development server using
    ```
     npm run dev
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[preview-1]: public/img/preview-1.png
[preview-2]: public/img/preview-2.png
[preview-3]: public/img/preview-3.png
