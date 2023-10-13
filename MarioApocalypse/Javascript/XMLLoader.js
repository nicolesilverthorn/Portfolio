function loadXMLDoc(filename)
{
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else // for IE 5/6
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", filename, false);
    xmlhttp.send();
    //document.write("XML document loaded into an XML DOM Object.");
    return xmlhttp.responseText;
}


function ieLoadXMLDoc(filename)
{
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else // code for IE5 and IE6
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", filename, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}