import React from "react";
import Header from "../components/Header";
import DocumentEditor from "../components/DocumentEditor";
function Document(){
    return(<>
    <Header/>
    <div>
        <h1>This is the Document Page!</h1>
        <DocumentEditor/>
    </div></>);
}



export default Document;