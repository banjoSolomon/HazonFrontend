import React, { useState, useEffect } from 'react';
import group from '../../asset/Group.png';
import Style from './index.module.css';

const ElephantDashboard = () => {
    const [elephants, setElephants] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePage, setActivePage] = useState('home');
    const [currentPage, setCurrentPage] = useState(1);
    const elephantsPerPage = 8;

    useEffect(() => {
        const fetchElephantsData = async () => {
            try {
                const response = await fetch('https://api.api-ninjas.com/v1/animals?name=elephant', {
                    headers: { 'X-Api-Key': 'OjG4/Qf9xn1A1gVgvhyjKg==UbMMYFBCPYlqPRnv' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    throw new Error("No data found for elephants.");
                }

                setElephants(data);
                fetchImages(data);

            } catch (err) {
                setError(err);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchImages = async (data) => {
            const urls = await Promise.all(data.map(async (elephant) => {
                const imageSearchResponse = await fetch(`https://api.unsplash.com/search/photos?query=${elephant.name}`, {
                    headers: { Authorization: `Client-ID 2jn46nan1F7M_AqumEhC9AIANlP4EPmjZ-5whYlkrB4` }
                });

                if (imageSearchResponse.ok) {
                    const imageData = await imageSearchResponse.json();
                    return imageData.results && imageData.results.length > 0 ? imageData.results[0].urls.regular : null;
                }
                return null;
            }));

            setImageUrls(urls);
        };

        fetchElephantsData();
    }, []);

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const handleNavigation = (page) => {
        setActivePage(page);
        setCurrentPage(1);
    };

    if (loading) {
        return <div className={Style.dashboard}>Loading...</div>;
    }

    if (error) {
        return <div className={Style.dashboard}>Error: {error.message}</div>;
    }

    const indexOfLastElephant = currentPage * elephantsPerPage;
    const indexOfFirstElephant = indexOfLastElephant - elephantsPerPage;
    const currentElephants = elephants.slice(indexOfFirstElephant, indexOfLastElephant);
    const totalPages = Math.ceil(elephants.length / elephantsPerPage);

    return (
        <div className={Style.dashboard}>
            <aside className={Style.sidebar}>
                <div className={Style.logo}>
                    <img className={Style.group} src={group} alt="Group logo" />
                </div>
                <nav>
                    <ul>
                        <li onClick={() => handleNavigation('home')} className={activePage === 'home' ? Style.active : ''}>Home</li>
                        <li onClick={() => handleNavigation('elephant')} className={activePage === 'elephant' ? Style.active : ''}>Elephant</li>
                    </ul>
                </nav>
            </aside>
            <main className={Style.mainContent}>
                <header className={Style.header}>
                    <p>Acumen Digital Interview Task / Elephantom</p>
                </header>
                <section className={Style.tableSection}>
                    <h2>All Elephants</h2>

                    {activePage === 'home' && (
                        <table>
                            <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Species</th>
                                <th>Sex</th>
                                <th>Affiliation</th>
                                <th>Dob</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentElephants.map((elephant, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstElephant + index + 1}</td>
                                    <td>{elephant.name}</td>
                                    <td>{elephant.taxonomy?.scientific_name || "Loading..."}</td>
                                    <td>{elephant.sex || "Loading..."}</td>
                                    <td>Affiliation {index + 1}</td> {/* Example affiliation */}
                                    <td>{elephant.dob || "Loading..."}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

                    {activePage === 'elephant' && (
                        <div>
                            {currentElephants.map((elephant, index) => (
                                <div key={index}>
                                    {imageUrls[index] ? <img src={imageUrls[index]} alt={elephant.name || "Elephant"} className={Style['elephant-image']} /> : null}
                                    <h2>{elephant.characteristics.common_name}</h2>
                                    <p>{elephant.characteristics.habitat}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={Style.pagination}>
                        <span>PAGE {currentPage} OF {totalPages}</span>
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>{"<"}</button>
                        <button className={Style.active}>{currentPage}</button>
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ElephantDashboard;