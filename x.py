from fpdf import FPDF

# Create a PDF document
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# Set title
pdf.set_font("Arial", 'B', 16)
pdf.cell(0, 10, "Node.js and MongoDB Overview", ln=True, align='C')

# Add content
pdf.set_font("Arial", size=12)

content = [
    ("1. Introduction to Node.js", 
     "Node.js is an open-source, cross-platform JavaScript runtime environment that executes "
     "JavaScript code outside a web browser. It is built on the V8 JavaScript engine used in "
     "Google Chrome, enabling developers to create server-side applications in JavaScript.\n\n"
     "Node.js is particularly known for its non-blocking, event-driven architecture, which "
     "allows it to handle multiple connections simultaneously. It is commonly used for building "
     "scalable network applications and APIs. Its package manager, npm (Node Package Manager), "
     "has a large ecosystem of libraries and tools that simplify development."),

    ("2. Node.js Architecture", 
     "Node.js architecture is designed around an event-driven, non-blocking I/O model. It "
     "utilizes a single-threaded event loop to manage requests and handle operations asynchronously.\n\n"
     "The architecture of Node.js consists of the following components:\n"
     "- Event Loop: The core of Node.js that processes events and executes queued sub-tasks.\n"
     "- Event Emitter: Allows objects to emit events and subscribe to them.\n"
     "- Callback Functions: Functions that are executed after a task is completed, enabling "
     "asynchronous programming.\n"
     "- Single Threaded: Though it operates on a single thread, Node.js can handle multiple "
     "connections concurrently through its event-driven architecture."),

    ("3. Introduction to MongoDB", 
     "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. It is designed "
     "to handle large volumes of unstructured data and provide high performance, scalability, and availability.\n\n"
     "MongoDB is document-oriented, which allows developers to store data in a format that closely "
     "resembles the data structures used in programming languages. It uses collections to group "
     "related documents, making it easy to work with complex data relationships. MongoDB supports features "
     "such as sharding (horizontal scaling), replication (data redundancy), and rich querying capabilities."),

    ("4. Installation Steps", 
     "Installation steps refer to the process of setting up Node.js and MongoDB on a development machine.\n\n"
     "To install Node.js:\n"
     "1. Download the Node.js installer from the official website (https://nodejs.org/).\n"
     "2. Run the installer and follow the prompts to complete the installation.\n"
     "3. Verify the installation by running node -v and npm -v in the command line.\n\n"
     "To install MongoDB:\n"
     "1. Download the MongoDB Community Server from the official website (https://www.mongodb.com/try/download/community).\n"
     "2. Follow the installation instructions for your operating system.\n"
     "3. Start the MongoDB service and verify the installation by connecting to the MongoDB shell using the command mongo."),

    ("5. CRUD Operations in MongoDB", 
     "CRUD stands for Create, Read, Update, and Delete, representing the four basic operations for managing data in a database.\n\n"
     "- Create: Add new documents to a collection using the insertOne() or insertMany() methods.\n"
     "- Read: Retrieve documents from a collection using the find() method, with options for filtering and projection.\n"
     "- Update: Modify existing documents with the updateOne(), updateMany(), or replaceOne() methods.\n"
     "- Delete: Remove documents from a collection using the deleteOne() or deleteMany() methods."),

    ("6. Query and Projection Operators", 
     "Query operators are special symbols used to specify conditions for retrieving data in MongoDB, while projection operators "
     "are used to specify which fields to return in the results.\n\n"
     "- Query Operators: Allow you to filter documents based on criteria, such as $eq (equal), $gt (greater than), "
     "$lt (less than), $in (matches any value in an array), and more.\n"
     "- Projection Operators: Enable you to control the fields returned in the query results, using operators like $slice "
     "(to limit the number of array elements returned) and $elemMatch (to return the first array element that matches the specified query).")
]

# Add content to PDF
for title, text in content:
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(0, 10, title, ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)
    pdf.ln(5)  # Add a little space between sections

# Save the PDF to a file
pdf_file_path = "C:\Users\nishi\Downloads"
pdf.output(pdf_file_path)

pdf_file_path