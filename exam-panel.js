// --- GLOBAL STATE ---
let currentExamName = '';
let currentExamCardId = '';
let timerInterval;
let isSectionASubmitted = false;
let currentSection = 'A'; // 'A' or 'B'
let currentQIndex = 0; // 0 to 9 for A, 10 to 19 for B
// Question Status: 0=Not Visited, 1=Visited (Not Answered), 2=Attempted
let questionStatus = new Array(20).fill(0); 
const totalQuestions = 20;
const questionsPerSection = 10;
const totalDurationMinutes = 20;
// --- MOCK QUESTION DATA (20 Qs per subject) ---
const EXAM_QUESTIONS = {
    'DBMS': [
        // Section A (1 Mark) - Q1 to Q10
        { id: 1, text: "Which language is used to define the structure of the database?", options: ["DML", "DDL", "DCL", "TCL"], answer: "DDL", marks: 1 },
        { id: 2, text: "Which key is used to establish and enforce a link between two tables?", options: ["Primary Key", "Super Key", "Foreign Key", "Candidate Key"], answer: "Foreign Key", marks: 1 },
        { id: 3, text: "The relational model is based on the concept of:", options: ["Records", "Pointers", "Tables", "Nodes"], answer: "Tables", marks: 1 },
        { id: 4, text: "In SQL, the command to delete an entire table and its structure is:", options: ["DELETE", "REMOVE", "DROP TABLE", "TRUNCATE TABLE"], answer: "DROP TABLE", marks: 1 },
        { id: 5, text: "What is an attribute or set of attributes that uniquely identifies a tuple?", options: ["Primary Key", "Foreign Key", "Unique Key", "Super Key"], answer: "Super Key", marks: 1 },
        { id: 6, text: "A row in a relational database is commonly referred to as a:", options: ["Attribute", "Field", "Tuple", "Schema"], answer: "Tuple", marks: 1 },
        { id: 7, text: "The process of organizing data to minimize redundancy and dependency is called:", options: ["Indexing", "Normalization", "Optimization", "De-fragmentation"], answer: "Normalization", marks: 1 },
        { id: 8, text: "Which ACID property ensures that all transactions are completed or none are?", options: ["Consistency", "Isolation", "Durability", "Atomicity"], answer: "Atomicity", marks: 1 },
        { id: 9, text: "BCNF is a higher form of:", options: ["1NF", "2NF", "3NF", "4NF"], answer: "3NF", marks: 1 },
        { id: 10, text: "A view in SQL is:", options: ["A temporary table", "A virtual table", "An index structure", "A physical file"], answer: "A virtual table", marks: 1 },

        // Section B (2 Marks) - Q11 to Q20
        { id: 11, text: "What is the primary function of a Database Management System (DBMS)?", options: ["Manage hardware resources", "Provide an interface for efficient data storage and retrieval", "Run operating systems", "Design network topologies"], answer: "Provide an interface for efficient data storage and retrieval", marks: 2 },
        { id: 12, text: "Explain the difference between a Candidate Key and a Primary Key.", options: ["PK must be unique; CK is not", "PK is chosen from CKs; CK is any minimal superkey", "CK is only for joins; PK is for indexing", "No difference"], answer: "PK is chosen from CKs; CK is any minimal superkey", marks: 2 },
        { id: 13, text: "Which of the following is an anomaly that normalization helps to solve?", options: ["Storage Anomaly", "Speed Anomaly", "Insertion Anomaly", "Network Anomaly"], answer: "Insertion Anomaly", marks: 2 },
        { id: 14, text: "A relationship where one instance in Table A can be related to many instances in Table B is called:", options: ["One-to-One", "Many-to-Many", "One-to-Many", "Many-to-One"], answer: "One-to-Many", marks: 2 },
        { id: 15, text: "The term 'Data Independence' in DBMS means:", options: ["Data is stored physically separate from the system", "Ability to change schema without affecting the dependent applications", "Data is not related to any application", "Data encryption standard"], answer: "Ability to change schema without affecting the dependent applications", marks: 2 },
        { id: 16, text: "Which property guarantees that the results of a committed transaction will survive permanently?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: "Durability", marks: 2 },
        { id: 17, text: "The use of the `GROUP BY` clause in SQL is typically followed by the aggregate function `HAVING` to:", options: ["Filter rows before grouping", "Filter groups based on a condition", "Sort the grouped data", "Calculate the sum of a column"], answer: "Filter groups based on a condition", marks: 2 },
        { id: 18, text: "What is the purpose of a checkpoint in transaction recovery?", options: ["To define the start of a transaction", "To temporarily store uncommitted data", "To reduce the amount of log required for recovery", "To mark the end of the log file"], answer: "To reduce the amount of log required for recovery", marks: 2 },
        { id: 19, text: "Denormalization is sometimes used to improve:", options: ["Data Integrity", "Query Performance", "Data Redundancy", "Data Security"], answer: "Query Performance", marks: 2 },
        { id: 20, text: "Which one of the following is a drawback of using triggers in a database?", options: ["Simplifies complex constraints", "Ensures data consistency", "Can cause cascading changes and performance issues", "Automates data modification tasks"], answer: "Can cause cascading changes and performance issues", marks: 2 }
    ],
    'IoT': [
        // Section A (1 Mark) - Q1 to Q10
        { id: 1, text: "What is the primary function of a Sensor in an IoT system?", options: ["Execute commands", "Collect data from the physical world", "Store cloud data", "Provide network connectivity"], answer: "Collect data from the physical world", marks: 1 },
        { id: 2, text: "Which layer is responsible for data transmission in the IoT architecture?", options: ["Application Layer", "Presentation Layer", "Network Layer", "Perception Layer"], answer: "Network Layer", marks: 1 },
        { id: 3, text: "What is the term for a device that converts electrical signals into a physical action?", options: ["Sensor", "Gateway", "Actuator", "Transducer"], answer: "Actuator", marks: 1 },
        { id: 4, text: "Which low-power wireless technology is commonly used in home automation IoT devices?", options: ["4G LTE", "Bluetooth Low Energy (BLE)", "Wi-Fi", "Ethernet"], answer: "Bluetooth Low Energy (BLE)", marks: 1 },
        { id: 5, text: "The 'Things' in IoT refer to:", options: ["People and processes", "Software applications", "Interconnected devices with unique identifiers", "Database servers"], answer: "Interconnected devices with unique identifiers", marks: 1 },
        { id: 6, text: "Which protocol is designed specifically for constrained devices and low-bandwidth networks in IoT?", options: ["HTTP", "FTP", "MQTT", "SMTP"], answer: "MQTT", marks: 1 },
        { id: 7, text: "The processing of data close to the source of generation is called:", options: ["Cloud Computing", "Fog Computing", "Distributed Computing", "Edge Computing"], answer: "Edge Computing", marks: 1 },
        { id: 8, text: "What does the 'M' stand for in the popular IoT protocol 'MQTT'?", options: ["Monitoring", "Messaging", "Machine", "Mobile"], answer: "Messaging", marks: 1 },
        { id: 9, text: "A key challenge in the Perception Layer of IoT is:", options: ["Data storage capacity", "Network latency", "Power consumption and battery life", "User interface design"], answer: "Power consumption and battery life", marks: 1 },
        { id: 10, text: "The unique identifier given to an IoT device is often a:", options: ["IP Address", "MAC Address", "UUID (Universally Unique Identifier)", "Web URL"], answer: "UUID (Universally Unique Identifier)", marks: 1 },

        // Section B (2 Marks) - Q11 to Q20
        { id: 11, text: "Explain the role of an IoT Gateway.", options: ["Only connects to the internet", "Manages the user interface and analytics", "Aggregates data from sensors and translates protocols for cloud communication", "Only executes local commands on actuators"], answer: "Aggregates data from sensors and translates protocols for cloud communication", marks: 2 },
        { id: 12, text: "Which security vulnerability is most critical for resource-constrained IoT devices?", options: ["SQL Injection", "Denial of Service (DoS) attacks", "Cross-site Scripting (XSS)", "Weak password policies"], answer: "Denial of Service (DoS) attacks", marks: 2 },
        { id: 13, text: "CoAP (Constrained Application Protocol) is often compared to which standard web protocol?", options: ["FTP", "SMTP", "HTTP", "TCP"], answer: "HTTP", marks: 2 },
        { id: 14, text: "The term 'M2M' (Machine-to-Machine) communication is a predecessor to IoT. What is the key difference?", options: ["M2M focuses on proprietary networks; IoT uses standard IP networks", "M2M is older; IoT is newer", "M2M is always wired; IoT is always wireless", "There is no difference"], answer: "M2M focuses on proprietary networks; IoT uses standard IP networks", marks: 2 },
        { id: 15, text: "What is the primary benefit of using a publish-subscribe model (like MQTT) over a client-server model for IoT data?", options: ["Faster response time for individual requests", "Simplified network configuration", "Decoupling of data producers and consumers (scalability)", "Better data encryption"], answer: "Decoupling of data producers and consumers (scalability)", marks: 2 },
        { id: 16, text: "In a smart city implementation, what function does the Application Layer typically perform?", options: ["Collects temperature data", "Routes data packets", "Provides smart services (e.g., traffic control, waste management)", "Handles device authentication"], answer: "Provides smart services (e.g., traffic control, waste management)", marks: 2 },
        { id: 17, text: "Which factor primarily limits the battery life of a wireless sensor node?", options: ["The quality of the enclosure", "The frequency of data transmission", "The amount of memory", "The size of the antenna"], answer: "The frequency of data transmission", marks: 2 },
        { id: 18, text: "Which networking technology offers the best range for wide-area IoT applications but typically lower bandwidth?", options: ["Wi-Fi", "Bluetooth", "LoRaWAN", "Zigbee"], answer: "LoRaWAN", marks: 2 },
        { id: 19, text: "What is the security risk associated with over-the-air (OTA) updates in IoT?", options: ["Data corruption during storage", "Physical theft of the device", "Infection by unauthorized firmware during transmission", "High power consumption"], answer: "Infection by unauthorized firmware during transmission", marks: 2 },
        { id: 20, text: "Which protocol is often used for device discovery and provisioning in a local IoT network?", options: ["DNS", "DHCP", "mDNS (Multicast DNS)", "ARP"], answer: "mDNS (Multicast DNS)", marks: 2 }
    ],
    'OOSE': [
        // Section A (1 Mark) - Q1 to Q10
        { id: 1, text: "Which principle of OOP involves binding data and the methods that operate on that data into a single unit?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], answer: "Encapsulation", marks: 1 },
        { id: 2, text: "In UML, which diagram is used to represent the static structure of a system, including its classes and relationships?", options: ["Sequence Diagram", "Activity Diagram", "Use Case Diagram", "Class Diagram"], answer: "Class Diagram", marks: 1 },
        { id: 3, text: "Which SDLC model emphasizes adapting to changing requirements rather than rigid planning?", options: ["Waterfall Model", "Spiral Model", "V-Model", "Agile Model"], answer: "Agile Model", marks: 1 },
        { id: 4, text: "A 'hasa' relationship between two classes is typically represented by:", options: ["Inheritance", "Association/Aggregation", "Dependency", "Realization"], answer: "Association/Aggregation", marks: 1 },
        { id: 5, text: "Which UML diagram shows the interactions between objects in a time-ordered sequence?", options: ["Class Diagram", "Sequence Diagram", "Component Diagram", "State Machine Diagram"], answer: "Sequence Diagram", marks: 1 },
        { id: 6, text: "The term 'Cohesion' in object-oriented design refers to:", options: ["The degree of interconnectedness between modules", "The degree to which elements within a module belong together", "The speed of execution", "The size of the codebase"], answer: "The degree to which elements within a module belong together", marks: 1 },
        { id: 7, text: "What are requirements that specify how the system should perform (e.g., speed, security)?", options: ["Functional Requirements", "Business Requirements", "User Requirements", "Non-Functional Requirements"], answer: "Non-Functional Requirements", marks: 1 },
        { id: 8, text: "Refactoring in software development is primarily done to:", options: ["Add new features", "Fix bugs", "Improve the internal structure without changing external behavior", "Translate code to a different language"], answer: "Improve the internal structure without changing external behavior", marks: 1 },
        { id: 9, text: "Which concept allows an object to take on many forms (e.g., method overloading)?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Generalization"], answer: "Polymorphism", marks: 1 },
        { id: 10, text: "The concept of hiding implementation details and showing only essential features is called:", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], answer: "Abstraction", marks: 1 },

        // Section B (2 Marks) - Q11 to Q20
        { id: 11, text: "Why is low coupling desirable in object-oriented design?", options: ["It makes the system slower", "It increases system complexity", "It makes modules easier to maintain, test, and reuse", "It only works with static methods"], answer: "It makes modules easier to maintain, test, and reuse", marks: 2 },
        { id: 12, text: "In the context of software testing, what is 'Black Box Testing'?", options: ["Testing the internal structure and code", "Testing the system functionality without knowledge of the internal code structure", "Testing only user interface elements", "Automated testing"], answer: "Testing the system functionality without knowledge of the internal code structure", marks: 2 },
        { id: 13, text: "A Use Case Diagram captures:", options: ["The structural relationships between classes", "The sequence of object interactions", "The functional requirements of a system from a user's perspective", "The internal logic of a single method"], answer: "The functional requirements of a system from a user's perspective", marks: 2 },
        { id: 14, text: "What is the key difference between Aggregation and Composition UML relationships?", options: ["Aggregation is always a one-to-one relationship", "Composition implies a strong 'part-of' relationship where the part cannot exist without the whole", "Aggregation is a weak relationship; Composition is not used in OOSE", "They are identical concepts"], answer: "Composition implies a strong 'part-of' relationship where the part cannot exist without the whole", marks: 2 },
        { id: 15, text: "Which of the following is NOT a phase in the traditional Waterfall Model?", options: ["Requirements", "Design", "Refactoring", "Maintenance"], answer: "Refactoring", marks: 2 },
        { id: 16, text: "Describe the purpose of a Design Pattern.", options: ["A complete, reusable piece of code", "A template for solving common design problems", "A set of coding standards", "A tool for debugging software"], answer: "A template for solving common design problems", marks: 2 },
        { id: 17, text: "In an Activity Diagram, what does a Swimlane represent?", options: ["A time delay", "A decision point", "A group of activities performed by the same organizational unit or actor", "The flow of control"], answer: "A group of activities performed by the same organizational unit or actor", marks: 2 },
        { id: 18, text: "Which characteristic best defines a well-defined software requirement?", options: ["Ambiguous", "Testable", "Subjective", "Flexible to interpretation"], answer: "Testable", marks: 2 },
        { id: 19, text: "Which type of polymorphism is achieved through method overriding in inherited classes?", options: ["Ad-hoc Polymorphism", "Inclusion Polymorphism (Subtyping)", "Parametric Polymorphism", "Coercion Polymorphism"], answer: "Inclusion Polymorphism (Subtyping)", marks: 2 },
        { id: 20, text: "The Unified Modeling Language (UML) is primarily used for:", options: ["Writing executable code", "Database management", "Visualizing, specifying, constructing, and documenting software system artifacts", "Project management scheduling"], answer: "Visualizing, specifying, constructing, and documenting software system artifacts", marks: 2 }
    ]
};
// Storage for user answers (key=QID, value=selected_option_value)
let userAnswers = {};
document.addEventListener('DOMContentLoaded', (event) => {
    // Initial checks for dashboard setup
    checkUpcomingExamsStatus();
    checkCompletedExamsStatus();
});
// --- Timer Functions ---
function startTimer(durationMinutes) {
    let time = durationMinutes * 60;
    const timerDisplay = document.getElementById('exam-timer'); 
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.textContent = minutes + ":" + seconds;
        if (--time < 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00";
            alert("Time's up! The exam is automatically submitted.");
            submitFinalExam(true); 
        }
    }, 1000);
}
// --- Exam Flow Functions ---
function startExam(examName, cardId) {
    currentExamName = examName;
    currentExamCardId = cardId;
    isSectionASubmitted = false; 
    currentSection = 'A';
    currentQIndex = 0;
    questionStatus.fill(0); // Reset all to Not Visited
    userAnswers = {}; // Clear previous answers
    document.getElementById('modal-exam-title').textContent = examName;
    document.getElementById('instructions-modal').style.display = 'flex';
}
function openExamPanel() {
    // FIX: Ensure the Instructions Modal is completely hidden before showing the Exam Panel
    document.getElementById('instructions-modal').style.display = 'none';
    document.getElementById('exam-panel-modal').style.display = 'block';  
    // Setup panel title and start timer
    document.getElementById('exam-panel-title').textContent = currentExamName + ' Exam';
    startTimer(totalDurationMinutes); 
    // Reset UI state for a fresh exam attempt
    document.getElementById('tab-a').classList.add('active');
    document.getElementById('tab-b').classList.add('locked'); // Lock Section B
    document.getElementById('tab-b').classList.remove('active');
    document.getElementById('q-status-grid-A').style.display = 'grid';
    document.getElementById('q-status-grid-B').style.display = 'none';
    // Generate sidebar and load the first question
    generateSidebar();
    // Update counts and colors for initial state (Q1 as current)
    updateQuestionCounts(); 
    loadQuestion(0);
}
function generateSidebar() {
    const gridA = document.getElementById('q-status-grid-A');
    const gridB = document.getElementById('q-status-grid-B');
    gridA.innerHTML = '';
    gridB.innerHTML = '';
    for (let i = 0; i < totalQuestions; i++) {
        const qNum = i + 1;
        const section = i < questionsPerSection ? 'A' : 'B';
        const grid = section === 'A' ? gridA : gridB;       
        const box = document.createElement('div');
        box.className = 'q-number-box status-not-visited';
        box.id = `q-box-${qNum}`;
        box.textContent = qNum;
        box.onclick = () => loadQuestion(i);
        
        if (section === 'B' && !isSectionASubmitted) {
            box.classList.add('status-locked');
        }       
        grid.appendChild(box);
    }
}
function switchSection(section) {
    if (section === 'B' && !isSectionASubmitted) {
        alert("Section B is currently locked. Please submit Section A first.");
        return;
    } 
    saveAnswer(); // Save answer for the question being left
    updateSidebarColors(); // Update status of the question being left
    // Update section state
    currentSection = section; 
    // Update tabs
    document.getElementById('tab-a').classList.toggle('active', section === 'A');
    document.getElementById('tab-b').classList.toggle('active', section === 'B');  
    // Show correct sidebar and set question index
    document.getElementById('q-status-grid-A').style.display = section === 'A' ? 'grid' : 'none';
    document.getElementById('q-status-grid-B').style.display = section === 'B' ? 'grid' : 'none';
    // Load the first question of the new section
    const newIndex = section === 'A' ? 0 : questionsPerSection;
    loadQuestion(newIndex);
}
function loadQuestion(index) {
    // Save the answer for the current question before moving
    saveAnswer();  
    // Set the new current index
    currentQIndex = index;  
    // Determine the section of the new question
    const newSection = index < questionsPerSection ? 'A' : 'B';
    // Handle accidental click on locked section B question box
    if (newSection === 'B' && !isSectionASubmitted) {
        alert("Section B is locked. Please submit Section A first.");
        // Revert back to the first question of section A
        currentQIndex = 0; 
        switchSection('A');
        return;
    }
    // If switching sections via sidebar, update UI
    if (newSection !== currentSection) {
         currentSection = newSection;
         document.getElementById('tab-a').classList.toggle('active', newSection === 'A');
         document.getElementById('tab-b').classList.toggle('active', newSection === 'B');
         document.getElementById('q-status-grid-A').style.display = newSection === 'A' ? 'grid' : 'none';
         document.getElementById('q-status-grid-B').style.display = newSection === 'B' ? 'grid' : 'none';
    }
    // Mark question as Visited (if Not Visited)
    if (questionStatus[currentQIndex] === 0) {
        questionStatus[currentQIndex] = 1;
    } 
    // Update Sidebar for the new current question and update counts
    updateSidebarColors();
    updateQuestionCounts();
    const questionData = EXAM_QUESTIONS[currentExamName][currentQIndex];
    const qContent = document.getElementById('current-question-content');   
    // Construct Question HTML
    let qHTML = `
        <p>${questionData.text}</p>
        <form id="q-form-${questionData.id}">
    `;   
    const isLocked = newSection === 'B' && !isSectionASubmitted;
    questionData.options.forEach((option, i) => {
        const optionValue = String.fromCharCode(65 + i); // A, B, C, D
        qHTML += `
            <div class="mcq-option">
                <label>
                    <input type="radio" name="q${questionData.id}" value="${optionValue}" 
                    ${userAnswers[questionData.id] === optionValue ? 'checked' : ''}
                    ${isLocked ? 'disabled' : ''}>
                    ${optionValue}. ${option}
                </label>
            </div>
        `;
    });
    qHTML += '</form>';
    qContent.innerHTML = qHTML;
    document.getElementById('current-q-num').textContent = questionData.id;
    document.getElementById('current-q-marks').textContent = `${questionData.marks} Mark${questionData.marks > 1 ? 's' : ''}`;
    
    // Update navigation button visibility
    updateNavigationButtons();
}
function saveAnswer() {
    const currentQData = EXAM_QUESTIONS[currentExamName][currentQIndex];
    const qID = currentQData.id;
    const form = document.getElementById(`q-form-${qID}`);
    
    if (form) {
        const selected = form.querySelector(`input[name="q${qID}"]:checked`);
        if (selected) {
            userAnswers[qID] = selected.value;
            // Update status to Attempted
            questionStatus[currentQIndex] = 2;
        } else if (questionStatus[currentQIndex] === 2) {
            // If the user previously answered but has now unchecked, set back to Visited (Not Answered)
            questionStatus[currentQIndex] = 1;
            delete userAnswers[qID];
        } else if (questionStatus[currentQIndex] === 0) {
            // Keep at 0 if never visited or answered
        } else {
            // Status is Visited (1), keep it at Visited (1)
            questionStatus[currentQIndex] = 1;
            delete userAnswers[qID];
        }
        // Persist a lightweight "recent course" entry so dashboard can show live progress
        try {
            if (currentExamName) {
                const attempted = questionStatus.filter(s => s === 2).length;
                const progressPercent = Math.round((attempted / totalQuestions) * 100);
                const recent = {
                    title: currentExamName,
                    progress: progressPercent,
                    // badge code is first 2 letters of exam name (fallback)
                    code: (currentExamName && String(currentExamName).slice(0,2).toUpperCase()) || '--'
                };
                localStorage.setItem('campus360_recent_course', JSON.stringify(recent));
            }
        } catch (e) { /* ignore storage errors */ }
    }
}
function navigateQuestion(direction) {
    saveAnswer(); // Always save before navigating

    let nextIndex = currentQIndex + direction;

    if (nextIndex >= 0 && nextIndex < totalQuestions) {
        // If moving from Q10 to Q11 and Section B is locked
        if (nextIndex === questionsPerSection && !isSectionASubmitted) {
            alert("Please submit Section A before proceeding to Section B.");
            updateNavigationButtons(); 
            return;
        }
        
        loadQuestion(nextIndex);
    } else if (direction === 1 && nextIndex === totalQuestions) {
        // Last question, prompt for submission
        alert("You are at the last question. Please submit your exam.");
    }
}
function updateNavigationButtons() {
    const isSectionA = currentQIndex < questionsPerSection;
    const isLastQofA = currentQIndex === questionsPerSection - 1;
    const isLastQofB = currentQIndex === totalQuestions - 1;

    document.getElementById('prev-button').disabled = currentQIndex === 0;
    
    // Default: Hide all specific action buttons
    document.getElementById('next-button').style.display = 'inline-block';
    document.getElementById('submit-section-button').style.display = 'none';
    document.getElementById('submit-final-button').style.display = 'none';

    if (isSectionA) {
        if (isLastQofA) {
            document.getElementById('next-button').style.display = 'none';
            document.getElementById('submit-section-button').style.display = 'inline-block';
        }
    } else { // Section B
        if (isLastQofB) {
            document.getElementById('next-button').style.display = 'none';
            document.getElementById('submit-final-button').style.display = 'inline-block';
        }
    }
}
function updateQuestionCounts() {
    let attemptedCount = 0; // Status 2
    let notAnsweredCount = 0; // Status 1 (Visited)
    let notVisitedCount = 0; // Status 0

    for(let status of questionStatus) {
        if (status === 2) {
            attemptedCount++;
        } else if (status === 1) {
            notAnsweredCount++;
        } else {
            notVisitedCount++;
        }
    }  
    document.getElementById('total-q-count').textContent = totalQuestions;
    document.getElementById('attempted-q-count').textContent = attemptedCount;
    document.getElementById('not-answered-q-count').textContent = notAnsweredCount;
    document.getElementById('not-visited-q-count').textContent = notVisitedCount;
}
function updateSidebarColors() {
    // Apply color to ALL boxes based on current status
    for(let i = 0; i < totalQuestions; i++) {
        const qID = i + 1;
        const box = document.getElementById(`q-box-${qID}`);
        if (!box) continue;
        box.classList.remove('status-current', 'status-not-visited', 'status-visited', 'status-attempted');
        if (i === currentQIndex) {
            box.classList.add('status-current');
        } else {
             if (questionStatus[i] === 2) {
                box.classList.add('status-attempted');
            } else if (questionStatus[i] === 1) {
                box.classList.add('status-visited');
            } else {
                box.classList.add('status-not-visited');
            }
        }
    }
}
function submitSectionA() {
    saveAnswer(); // Save the last question's answer (Q10)
    const answeredQuestions = questionStatus.slice(0, questionsPerSection).filter(s => s === 2).length;  
    if (answeredQuestions < questionsPerSection) { 
        if (!confirm(`You have only answered ${answeredQuestions} questions out of ${questionsPerSection} in Section A. Are you sure you want to submit and proceed to Section B? You cannot return.`)) {
            return;
        }
    }
    // 1. Lock Section A logic
    isSectionASubmitted = true;
    document.getElementById('tab-a').classList.add('locked');
    document.getElementById('tab-a').classList.remove('active');  
    // 2. Unlock Section B tab
    document.getElementById('tab-b').classList.remove('locked');  
    // 3. Unlock Section B question boxes
    for (let i = questionsPerSection; i < totalQuestions; i++) {
        const box = document.getElementById(`q-box-${i + 1}`);
        if (box) box.classList.remove('status-locked');
    }
    // 4. Automatically switch to Section B view and load Q11
    switchSection('B'); 
    
    alert('Section A submitted successfully! You can now proceed to Section B.');
}
function submitFinalExam(isAutoSubmit = false) {
    saveAnswer(); // Save the very last question's answer

    if (!isSectionASubmitted && !isAutoSubmit) {
        alert('Internal error: Section A was not submitted.');
        return;
    }   
    if (!isAutoSubmit) {
        // Count unattempted questions in total
        const unattemptedTotal = questionStatus.filter(s => s !== 2).length;
        
         if (unattemptedTotal > 0) { 
            if (!confirm(`You still have ${unattemptedTotal} questions either Not Visited or Not Answered in total. Are you sure you want to submit the final exam?`)) {
                return;
            }
        }
        if (!confirm('Are you sure you want to submit the final exam?')) {
            return;
        }
    }   
    // 1. Stop the timer
    clearInterval(timerInterval);   
    // 2. Hide the main exam panel
    document.getElementById('exam-panel-modal').style.display = 'none';  
    // 3. Move the card from Upcoming to Completed
    // Persist final completed course as the most recent attempt (100% progress)
    try {
        if (currentExamName) {
            const recentFinal = {
                title: currentExamName,
                progress: 100,
                code: (currentExamName && String(currentExamName).slice(0,2).toUpperCase()) || '--'
            };
            localStorage.setItem('campus360_recent_course', JSON.stringify(recentFinal));
        }
    } catch (e) { /* ignore */ }
    moveExamCard(currentExamName, currentExamCardId);
    // 4. Show final confirmation pop-up
    document.getElementById('submitted-exam-title').textContent = currentExamName;
    document.getElementById('final-submission-modal').style.display = 'flex';
}
function closeFinalSubmissionModal() {
    document.getElementById('final-submission-modal').style.display = 'none';
}
// --- Utility Functions (Reused/Modified) ---
function checkUpcomingExamsStatus() {
    const upcomingColumn = document.getElementById('upcoming-exams');
    const examCards = upcomingColumn.querySelectorAll('.exam-card');
    const emptyMessage = document.getElementById('upcoming-empty-message');

    if (examCards.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}
function checkCompletedExamsStatus() {
    const completedColumn = document.getElementById('completed-exams');
    const examCards = completedColumn.querySelectorAll('.exam-card');
    const emptyMessage = document.getElementById('completed-empty-message');

    if (examCards.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}
function moveExamCard(examName, cardId) {
    const completedColumn = document.getElementById('completed-exams');
    const upcomingCard = document.getElementById(cardId);
    let subjectDepartment = 'N/A';
    let cardIconClass = '';
    let iconColorClass = '';
    if (upcomingCard) {
        subjectDepartment = upcomingCard.querySelector('.department') ? upcomingCard.querySelector('.department').textContent : 'N/A';
        const iconElement = upcomingCard.querySelector('.card-icon');
        cardIconClass = iconElement ? iconElement.className.replace('card-icon', '').trim() : '';
        iconColorClass = iconElement ? iconElement.className.split(' ').find(cls => cls.startsWith('icon-')) : '';
        upcomingCard.remove();
        checkUpcomingExamsStatus(); 
    }
    const completedCardHTML = `
        <div class="exam-card">
            <div class="card-content">
                <i class="${cardIconClass} card-icon ${iconColorClass}"></i>
                <div class="text-info">
                    <div class="subject-name">${examName}</div>
                    <div class="department">${subjectDepartment}</div>
                </div>
            </div>
            <button class="review-button" onclick="reviewAnswers('${examName}')">Review Answers</button>
        </div>
    `;
    completedColumn.insertAdjacentHTML('beforeend', completedCardHTML);
    checkCompletedExamsStatus();
}
function reviewAnswers(examName) {
    const questions = EXAM_QUESTIONS[examName];
    if (!questions) {
        alert('No questions found for the selected exam.');
        return;
    }

    // 1. Open a new window
    const reviewWindow = window.open('', '_blank');
    const doc = reviewWindow.document;

    // 2. Start the HTML structure and inject CSS
    doc.write(`
        <html>
        <head>
            <title>Review Answers for ${examName}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* --- Core Colors and Variables --- */
                :root {
                    --purple-dark: #6A1B9A;
                    --purple-medium: #8A4BAA;
                    --purple-light-start: #F5F5FF; 
                    --purple-light-end: #DCD6EA;
                    --text-color-body: #333333;
                    --answer-green: #4CAF50;
                    --nav-height: 60px; /* Define the base height for the fixed nav */
                    --nav-safe-space: 20px; /* NEW: Extra space below the header */
                }

                /* --- Animated Background Setup --- */
                @keyframes subtle-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    /* CALCULATED PADDING: nav-height + safe-space */
                    padding-top: calc(var(--nav-height) + var(--nav-safe-space)); 
                    padding-bottom: 50px; 
                    min-height: 100vh;
                    color: var(--text-color-body);
                    line-height: 1.6;
                    
                    /* Apply Animated Gradient */
                    background: linear-gradient(-45deg, var(--purple-light-start), #EFEFFF, var(--purple-light-end), #F5F5FF);
                    background-size: 400% 400%;
                    animation: subtle-shift 15s ease infinite;
                }

                /* --- FIXED, FULL-WIDTH HEADER --- */
                .header-content {
                    background-color: var(--purple-dark); 
                    color: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                    height: var(--nav-height); 

                    /* Lock to top and make full-width */
                    position: fixed; 
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 1000;
                    
                    /* Center content horizontally and vertically */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Inner container to constrain title and button for alignment */
                .header-inner-content {
                    max-width: 1200px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 0 30px; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-content h1 {
                    margin: 0;
                    font-size: 1.8em;
                    font-weight: 600;
                    text-align: left;
                    flex-grow: 1;
                }

                /* --- Close Button Style --- */
                .close-button {
                    background-color: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9em;
                    margin-left: 20px;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .close-button:hover {
                    background-color: white;
                    color: var(--purple-dark);
                    border-color: white;
                }

                /* --- Main Content Layout --- */
                .review-container {
                    padding: 0 20px; 
                    max-width: 1000px; 
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                /* --- Question Box (Card) Style --- */
                .question-box {
                    background-color: #FFFFFF;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s; 
                }
                .question-box:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                /* --- Question Text Style --- */
                .question-text {
                    font-size: 1.15em;
                    color: var(--purple-medium); 
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed #E0E0E0;
                    font-weight: 600; 
                }
                .question-text strong {
                    color: var(--purple-dark);
                }

                /* --- Answer Highlight Style --- */
                .answer-row {
                    font-size: 1em;
                    margin-top: 15px;
                    padding: 12px 15px;
                    background-color: #e8f5e9; 
                    border-left: 6px solid var(--answer-green); 
                    border-radius: 4px;
                    color: #1B5E20; 
                }
                .answer-row strong {
                    color: var(--purple-dark);
                    font-weight: 700;
                    margin-right: 5px;
                }

                /* --- Responsiveness for smaller screens --- */
                @media (max-width: 600px) {
                    :root {
                        --nav-height: 55px;
                        --nav-safe-space: 15px; /* Smaller safe space on mobile */
                    }
                    .header-content h1 {
                        font-size: 1.3em;
                    }
                    .close-button {
                        padding: 6px 10px;
                        font-size: 0.8em;
                    }
                    .review-container {
                        padding: 0 10px;
                    }
                }
            </style>
        </head>
        <body>
            <header class="header-content">
                <div class="header-inner-content">
                    <h1>Review Answers for ${examName}</h1>
                    <button class="close-button" onclick="window.close()">Close Review</button>
                </div>
            </header>
            <div class="review-container">
    `);

    // 3. Loop through questions and generate styled content
    questions.forEach((question, index) => {
        const answerText = question.answer ? question.answer.toUpperCase() : 'N/A';

        doc.write(`
            <div class="question-box">
                <p class="question-text">
                    <strong>Q${index + 1}:</strong> ${question.text}
                </p>
                <div class="answer-row">
                    <strong>Correct Answer:</strong> ${answerText}
                </div>
            </div>
        `);
    });

    // 4. Close the HTML structure
    doc.write(`
            </div>
        </body>
        </html>
    `);
    doc.close();
}
