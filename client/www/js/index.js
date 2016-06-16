/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var ws;
var ip;
var user_name;
var target="Bob";
var back="";
function addMessage(msgtext,side,target)
{
    var msgdiv = document.getElementById("messages"+target);
    if (msgdiv == null)
    {
	alert("Message from new user: "+ target);
	var msgview = document.getElementById("messaging");
	msgdiv = document.createElement("div");
	msgdiv.id = "messages"+target;
	msgdiv.className = "messageList";
	msgdiv.appendChild(document.createTextNode("Messages From "+target));
	msgview.insertBefore(msgdiv,msgview.firstChild);

	var cntdiv = document.getElementById("contactList");
	var newcnt = document.createElement("button");
	newcnt.className = "greenButton";
	newcnt.style = "height:15%;";
	var thattarget = target;
	newcnt.onclick = function() {activate(thattarget)};
	newcnt.appendChild(document.createTextNode(target));
	cntdiv.appendChild(newcnt);
    }
    var newmsg = document.createElement("div");
    newmsg.classList.add("message");
    newmsg.classList.add(side);
    newmsg.appendChild(document.createTextNode(msgtext));
    msgdiv.appendChild(newmsg);
    
    msgdiv.scrollTop = msgdiv.scrollHeight;
}

function sendthis()
{
    var msgText=document.getElementById("msgText").value;
    document.getElementById("msgText").value = "";
    ws.send("M<"+user_name+"><"+target+">"+msgText);
    addMessage(msgText,"right",target);
}

function activate(whom)
{
    target=whom;
    var views = document.getElementsByClassName("messageList");
    var i;
    for (i = 0; i < views.length; i++)
    {
	views[i].style.display="none";
    }
    var msgList=document.getElementById('messages'+target);
    msgList.style.display="block";
    back = "contacts";
    show_view("messaging");
}

function connect()
{
    ip = document.getElementById('ipaddr').value;
    user_name = document.getElementById('name').value;
    if ("WebSocket" in window)
    {
	document.getElementById('state').innerHTML = "Connecting ...";
        
        // Let us open a web socket
        ws = new WebSocket("ws://"+ip+"/echo");
	
        ws.onopen = function()
        {
	    document.getElementById('state').innerHTML = "Logged in to "+ip+ " as " + user_name;
	    document.getElementById('buttonDisconnect').style.display="block";
	    show_view("contacts");

	    //register
	    ws.send("I"+user_name);
        };
	
        ws.onmessage = function (evt) 
        {
	    if (user_name.substr(0,8)=="monitor_")
	    {
		alert("Trying to send message");
	    }
	    else
	    {
		var txt = evt.data;
		fin = txt.indexOf('>');
		sender = txt.substr(2,fin-2);
		msg = txt.substr(fin+1,txt.length);
		addMessage(msg,"left",sender);
	    }
        };
	
        ws.onclose = function()
        {
            document.getElementById('state').innerHTML = "Not connected";
	    document.getElementById('buttonDisconnect').style.display="none";
	    show_view("connection");
        };
    }
    
    else
    {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
}

function disconnect()
{
    ws.close()
}
    
function show_dropdown()
{
    document.getElementById("dropdownNames").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function set_dropdown(name)
{
    document.getElementById("name").value = name
}

function show_view(view)
{
    var views = document.getElementsByClassName("view");
    var i;
    for (i = 0; i < views.length; i++)
    {
	views[i].style.display="none";
    }
    document.getElementById(view).style.display="block";
}

function go_back()
{
    if (back !="")
	show_view(back);
    back = "";
}

window.onload=function()
{
    show_view("connection");
};

document.addEventListener("backbutton", go_back,false);
