/* =========================================================
   COLLEGE MANAGEMENT WEBSITE
   JSON FETCH + DYNAMIC CATEGORY FILTER
   ========================================================= */

const JSON_FILE = "./college-data.json";

let collegeData = null;
let currentCategory = "all";


// =========================================================
// 1. LOAD JSON DATA
// =========================================================

async function loadCollegeData() {

    try {

        showLoading();

        const response = await fetch(JSON_FILE);

        if (!response.ok) {
            throw new Error(
                `Unable to load college-data.json (${response.status})`
            );
        }

        collegeData = await response.json();

        console.log("JSON Loaded Successfully:", collegeData);

        createFilterButtons();

        showCategory("all");

    } catch (error) {

        console.error("JSON Error:", error);

        showError(error.message);

    }
}


// =========================================================
// 2. FIND MAIN CONTENT AREA
// =========================================================

function getMainContainer() {

    let container =
        document.getElementById("dynamicContent") ||
        document.getElementById("dataContainer") ||
        document.getElementById("content");

    if (!container) {

        container = document.createElement("main");

        container.id = "dynamicContent";

        document.body.appendChild(container);
    }

    return container;
}


// =========================================================
// 3. LOADING MESSAGE
// =========================================================

function showLoading() {

    const container = getMainContainer();

    container.innerHTML = `
        <div class="loading-message">
            <h2>Loading College Data...</h2>
            <p>Please wait while the data is being loaded.</p>
        </div>
    `;
}


// =========================================================
// 4. ERROR MESSAGE
// =========================================================

function showError(message) {

    const container = getMainContainer();

    container.innerHTML = `
        <div class="error-message">

            <h2>⚠️ Unable to Load Data</h2>

            <p>
                ${message}
            </p>

            <p>
                Make sure <strong>college-data.json</strong>
                is in the same folder as index.html and
                run the project using VS Code Live Server.
            </p>

        </div>
    `;
}


// =========================================================
// 5. CREATE FILTER BUTTONS
// =========================================================

function createFilterButtons() {

    let filterContainer =
        document.getElementById("filterButtons");

    if (!filterContainer) {

        filterContainer =
            document.createElement("div");

        filterContainer.id =
            "filterButtons";

        filterContainer.className =
            "filter-buttons";

        const main =
            getMainContainer();

        main.parentNode.insertBefore(
            filterContainer,
            main
        );
    }

    filterContainer.innerHTML = "";

    const categories = [

        {
            id: "all",
            name: "All"
        },

        {
            id: "academic",
            name: "Academic"
        },

        {
            id: "students",
            name: "Students"
        },

        {
            id: "teachers",
            name: "Teachers"
        },

        {
            id: "courses",
            name: "Courses"
        },

        {
            id: "departments",
            name: "Departments"
        },

        {
            id: "exams",
            name: "Exams"
        },

        {
            id: "library",
            name: "Library"
        },

        {
            id: "notices",
            name: "Notices"
        }

    ];


    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.textContent =
            category.name;

        button.dataset.category =
            category.id;

        button.className =
            "filter-btn";


        if (category.id === "all") {

            button.classList.add("active");

        }


        button.addEventListener(
            "click",
            () => {

                showCategory(
                    category.id
                );

                updateActiveButton(
                    button
                );

            }
        );


        filterContainer.appendChild(
            button
        );

    });

}


// =========================================================
// 6. UPDATE ACTIVE BUTTON
// =========================================================

function updateActiveButton(activeButton) {

    document
        .querySelectorAll(".filter-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    activeButton.classList.add(
        "active"
    );

}


// =========================================================
// 7. SHOW SELECTED CATEGORY
// =========================================================

function showCategory(category) {

    currentCategory =
        category;

    const container =
        getMainContainer();


    if (!collegeData) {

        return;

    }


    container.innerHTML = "";


    // ALL DATA
    if (category === "all") {

        renderAllData(
            collegeData,
            container
        );

        return;

    }


    // ACADEMIC
    if (category === "academic") {

        renderAcademic(
            collegeData,
            container
        );

        return;

    }


    // NORMAL CATEGORIES
    const data =
        collegeData[category];


    if (!data) {

        container.innerHTML = `

            <div class="error-message">

                <h2>Data Not Found</h2>

                <p>
                    No "${category}" data
                    was found in the JSON file.
                </p>

            </div>

        `;

        return;

    }


    renderSection(
        category,
        data,
        container
    );

}


// =========================================================
// 8. SHOW ALL DATA
// =========================================================

function renderAllData(data, container) {

    const sections = [

        "academic",
        "students",
        "teachers",
        "courses",
        "departments",
        "exams",
        "library",
        "notices"

    ];


    sections.forEach(section => {

        if (!data[section]) {

            return;

        }


        if (section === "academic") {

            renderAcademic(
                data,
                container
            );

        } else {

            renderSection(
                section,
                data[section],
                container
            );

        }

    });

}


// =========================================================
// 9. ACADEMIC DATA
// =========================================================

function renderAcademic(data, container) {

    const academic =
        data.academic;


    if (!academic) {

        return;

    }


    const section =
        document.createElement("section");

    section.className =
        "dynamic-section";


    section.innerHTML = `

        <div class="section-container">

            <h2>Academic Information</h2>

            <p>
                Explore academic information
                of the institution.
            </p>

        </div>

    `;


    const grid =
        document.createElement("div");

    grid.className =
        "data-grid";


    Object.entries(academic)
        .forEach(([key, value]) => {

            const card =
                createCard(
                    formatTitle(key),
                    value
                );

            grid.appendChild(card);

        });


    section
        .querySelector(".section-container")
        .appendChild(grid);


    container.appendChild(section);

}


// =========================================================
// 10. RENDER NORMAL SECTION
// =========================================================

function renderSection(
    title,
    data,
    container
) {

    const section =
        document.createElement("section");

    section.className =
        "dynamic-section";


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "section-container";


    wrapper.innerHTML = `

        <h2>
            ${formatTitle(title)}
        </h2>

        <p>
            ${getSectionDescription(title)}
        </p>

    `;


    const grid =
        document.createElement("div");

    grid.className =
        "data-grid";


    // ARRAY DATA
    if (Array.isArray(data)) {

        data.forEach(item => {

            grid.appendChild(
                createCardFromObject(item)
            );

        });

    }


    // OBJECT DATA
    else if (
        typeof data === "object"
    ) {

        Object.entries(data)
            .forEach(([key, value]) => {

                grid.appendChild(

                    createCard(
                        formatTitle(key),
                        value
                    )

                );

            });

    }


    // STRING / NUMBER
    else {

        grid.appendChild(

            createCard(
                formatTitle(title),
                data
            )

        );

    }


    wrapper.appendChild(grid);

    section.appendChild(wrapper);

    container.appendChild(section);

}


// =========================================================
// 11. CREATE CARD FROM OBJECT
// =========================================================

function createCardFromObject(item) {

    const card =
        document.createElement("article");

    card.className =
        "data-card";


    if (
        typeof item === "object" &&
        item !== null
    ) {

        let html = "";


        Object.entries(item)
            .forEach(([key, value]) => {

                if (
                    typeof value === "object"
                ) {

                    value =
                        JSON.stringify(
                            value
                        );

                }


                html += `

                    <div class="data-row">

                        <strong>
                            ${formatTitle(key)}
                        </strong>

                        <span>
                            ${value}
                        </span>

                    </div>

                `;

            });


        card.innerHTML = html;

    } else {

        card.innerHTML = `

            <p>
                ${item}
            </p>

        `;

    }


    return card;

}


// =========================================================
// 12. CREATE SIMPLE CARD
// =========================================================

function createCard(title, value) {

    const card =
        document.createElement("article");

    card.className =
        "data-card";


    if (
        typeof value === "object"
    ) {

        value =
            JSON.stringify(
                value,
                null,
                2
            );

    }


    card.innerHTML = `

        <h3>
            ${title}
        </h3>

        <p>
            ${value}
        </p>

    `;


    return card;

}


// =========================================================
// 13. FORMAT TITLES
// =========================================================

function formatTitle(text) {

    return String(text)

        .replace(
            /([A-Z])/g,
            " $1"
        )

        .replace(
            /[-_]/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim()

        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


// =========================================================
// 14. SECTION DESCRIPTION
// =========================================================

function getSectionDescription(section) {

    const descriptions = {

        students:
            "Student information and academic records.",

        teachers:
            "Faculty members and teaching staff.",

        courses:
            "Courses and programs offered by the institution.",

        departments:
            "Academic departments of the institution.",

        exams:
            "Examination schedules and information.",

        library:
            "Library resources and available books.",

        notices:
            "Latest college announcements and notices."

    };


    return (
        descriptions[section] ||
        "Information provided by the college."
    );

}


// =========================================================
// 15. START APPLICATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    loadCollegeData
);