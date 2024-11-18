let openMobilePost;
let mobilePostIsOpen = false;
let openMobilePostRect;
let openMobilePostSpacer;
let existingMargin;
async function openMobilePostView(post) {
  openMobilePost = post;
  mobilePostIsOpen = true;
  scrollingEnabled = false;

  existingMargin = post.style.margin;
  openMobilePostRect = post.getBoundingClientRect();
  openMobilePostSpacer = createElement("postSpacer", "div", post, { width: openMobilePostRect.width + "px", height: openMobilePostRect.height + "px", margin: existingMargin, "margin-bottom": post.style.marginBottom });
  if (existingMargin != "") {
    openMobilePostSpacer.style.margin = existingMargin;
  } else {
    openMobilePostSpacer.style.marginBottom = "8px";
  }
  post.parentElement.insertBefore(openMobilePostSpacer, post);

  post.style.position = "fixed";
  post.style.width = openMobilePostRect.width + "px";
  post.style.height = openMobilePostRect.height + "px";
  post.style.left = openMobilePostRect.left + "px";
  post.style.top = openMobilePostRect.top + "px";
  post.style.margin = "0px";
  post.style.zIndex = "999";
  post.style.transition = "0.35s ease-in-out";
  post.querySelector(".postPost").style.transition = "0.35s";

  let postChat = post.querySelector(".postChat");
  postChat.style.opacity = 0;
  postChat.style.display = "";
  postChat.style.width = "calc(100% - 16px)";
  postChat.style.height = "calc(100% - 58px)";
  postChat.style.top = "8px";
  postChat.style.left = "8px";
  postChat.style.borderRadius = "12px";
  postChat.style.transition = "0.35s";

  post.querySelector(".postPost").style.pointerEvents = "none";
  postChat.style.pointerEvents = "all";

  await sleep(1);
  post.style.width = "100%";
  post.style.height = "100%";
  post.style.top = "0px";
  post.style.left = "0px";
  post.style.borderRadius = "0px";
  post.querySelector(".postPost").style.opacity = 0;
  postChat.style.opacity = 1;
  //await sleep(350);
  post.querySelector(".postChatHolder").scrollTo({ top: post.querySelector(".postChatHolder").scrollHeight });
  let mobileChatBackButton = createElement("mobileChatBackButton", "div", post);
  mobileChatBackButton.innerHTML = `<svg width="32" height="32" viewBox="0 0 410 237" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M36 36L196.515 196.515C201.201 201.201 208.799 201.201 213.485 196.515L374 36" stroke="var(--themeColor)" stroke-width="72" stroke-linecap="round"/> </svg>`;
  mobileChatBackButton.addEventListener("click", closeMobileChat);
}
async function closeMobileChat() {
  if (mobilePostIsOpen == false) {
    return;
  }
  mobilePostIsOpen = false;
  scrollingEnabled = true;

  openMobilePost.querySelector(".mobileChatBackButton").remove();
  openMobilePost.querySelector(".postPost").style.pointerEvents = "all";
  openMobilePost.querySelector(".postChat").style.pointerEvents = "none";

  openMobilePost.style.width = openMobilePostRect.width + "px";
  openMobilePost.style.height = openMobilePostRect.height + "px";
  openMobilePost.style.left = openMobilePostRect.left + "px";
  openMobilePost.style.top = openMobilePostRect.top + "px";
  openMobilePost.style.borderRadius = "";
  openMobilePost.querySelector(".postPost").style.opacity = 1;
  openMobilePost.querySelector(".postChat").style.opacity = 0;
  await sleep(350);
  openMobilePost.style.transition = "";
  openMobilePost.style.position = "";
  openMobilePostSpacer.remove();
  openMobilePost.style.width = "";
  openMobilePost.style.height = "";
  openMobilePost.style.left = "";
  openMobilePost.style.top = "";
  openMobilePost.style.margin = existingMargin;
  openMobilePost.style.zIndex = "";
}

modules.actions = function() {
  body.addEventListener("click", async function(e) {
    if (e.button != 0) {
      return;
    }
    let path = e.path || (e.composedPath && e.composedPath());
    let button = path[0].closest("[type]");
    let type = "";
    if (button != null) {
      type = button.getAttribute("type");
    }
    if (e.target.hasAttribute("href") == true) {
      return;
    }

    let actions = {
      // Post Actions:
      like: async function(button, post) {
        if (userID == null) {
          promptLogin('Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style="color: #FF5786">Like</b> a post!')
          return;
        }
        function updateLike(type) {
          let likeAmount = findI("likes" + post.id);
          let icon = button.querySelector("svg").querySelector("path");
          let svg = button.querySelector("svg");
          if (type == "like") {
            button.setAttribute("isLiked", "");
            button.parentElement.style.color = "#FF5786";
            icon.setAttribute("fill", "#FF5786");
            icon.setAttribute("stroke", "#FF5786");
            changeCounter(likeAmount, parseInt(likeAmount.getAttribute("realnum"),10)+1);
            svg.style.animation = "like 0.8s";
            setTimeout(function() {
              svg.style.animation = null;
            }, 800);
          } else {
            button.removeAttribute("isLiked");
            button.parentElement.style.removeProperty("color");
            icon.removeAttribute("fill");
            icon.setAttribute("stroke", "#999");
            changeCounter(likeAmount, parseInt(likeAmount.getAttribute("realnum"),10)-1);
          }
        }
        if (button.hasAttribute("isLiked") == false) {
          updateLike("like");
          let [code] = await sendRequest("PUT", "posts/like?postid=" + post.id);
          if (code != 200) {
            updateLike("unlike");
          }
        } else {
          updateLike("unlike");
          let [code] = await sendRequest("DELETE", "posts/unlike?postid=" + post.id);
          if (code != 200) {
            updateLike("like");
          }
        }
      },
      quote: async function(button, post) {
        if (userID == null) {
          promptLogin('Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style="color: #C95EFF">Quote</b> a post!')
          return;
        }
        let postTextArea = findI("newPostArea");
        if (postTextArea == null) {
          await setPage("home");
        }
        postTextArea = findI("newPostArea");
        postTextArea.innerHTML += "/Post_" + post.id + "&nbsp;";
        setCurrentCursorPosition(postTextArea, postTextArea.textContent.length);
      },
      actionchat: async function(button, post) {
        if (isMobile != true) {
          if (userID == null) {
            promptLogin('Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style="color: var(--themeColor)">Chat</b> on a post!')
            return;
          }
          post.querySelector(".postChatInput").focus();
        } else {
          openMobilePostView(post);
        }
      },
      extra: async function(button, post) {
        let dropdownButtons = [
          ["Copy Text", "var(--themeColor)", function() {
            copyClipboardText(post.getAttribute("text"));
          }],
          ["Copy ID", "var(--themeColor)", function() {
            copyClipboardText("/Post_" + post.id);
          }]
        ];
        if (button.hasAttribute("jump")) {
          dropdownButtons.unshift(["Jump to Post", "var(--themeColor)", function() {
            modifyParams("post", post.id);
            setPage("viewpost");
          }]);
        }
        function editPost() {
					let postText = post.getAttribute("text").replace(/@([A-Za-z0-9]+)"([^"]+)"/g, "@$2")
          let postUI = `<div style="display:flex;flex-direction:column;"><div contenteditable="true" id="editPost" onpaste="clipBoardRead(event)">${postText.replaceAll("\n", "<br>")}</div><span id="editPostCharCount">${postText.replaceAll("\n", "").length}/800</span></div>`
          showPopUp("Edit Post", postUI, [["Save", "var(--premiumColor)", async function() {
            post.style.opacity = "0.5";
            let sendFormData = new FormData();
	          sendFormData.append("data", JSON.stringify({ text: findI("editPost").innerText.replace(/@([\w-]+)/g, "@$1 ") }));
            let [code, response] = await sendRequest("POST", `posts/edit?postid=${post.id} `, sendFormData, true);
           
            if (code != 200) {
              showPopUp("An Error Occured", response, [["OK", "var(--grayColor)"]]);
							post.style.opacity = "1";
            }
          }], ["Cancel", "var(--grayColor)"]]);
          const editPostCharCount = findI('editPostCharCount');
          const editPost = findI('editPost');
					editPost.focus();
          editPost.addEventListener('input', function(){
            editPostCharCount.innerText = `${editPost.textContent.length}/800`;
          });
        }
        function deletePost() {
          showPopUp("Delete Post?", "Are you sure you want to <b>permanently</b> delete this post?", [["Delete", "#FF5C5C", async function() {
            post.style.opacity = "0.5";
            let [code, response] = await sendRequest("DELETE", "posts/delete?postid=" + post.id);
            if (code != 200) {
              post.style.opacity = "1";
              showPopUp("Error Deleting", response, [["Okay", "var(--grayColor)"]]);
            }
          }], ["Wait, no", "var(--grayColor)"]]);
        }
        let viewGroupID = getParam("group");
        //let postedGroup = groups[viewGroupID || ""];
        //if (postedGroup != null && postedGroup.Owner == userID) {
        if (post.getAttribute("userid") == userID) {
          if (viewGroupID == null) {
            if (account.ProfileData != null && account.ProfileData.PinnedPost == post.id) {
              dropdownButtons.unshift(["Unpin Post", "#C95EFF", function() {
                showPopUp("Unpin this Post?", "Unpinning this post will remove it from the top of your profile. It won't delete the post.", [["Unpin", "#C95EFF", function() {
                  sendRequest("DELETE", "posts/unpin");
                  account.ProfileData = account.ProfileData || {};
                  delete account.ProfileData.PinnedPost;
                  refreshPage();
                }], ["Wait, no", "var(--grayColor)"]]);
              }]);
            } else {
              dropdownButtons.unshift(["Pin Post", "#C95EFF", function() {
                showPopUp("Pin this Post?", "Pinning this post will keep it at the top of your profile. If another post is already pinned, it will be replaced by this post.", [["Pin", "#C95EFF", function() {
                  sendRequest("PUT", "posts/pin?postid=" + post.id);
                  account.ProfileData = account.ProfileData || {};
                  account.ProfileData.PinnedPost = post.id;
                  refreshPage();
                }], ["Wait, no", "var(--grayColor)"]]);
              }]);
            }
          }
          if (hasPremium()) {
            dropdownButtons.unshift(["Edit Post", "var(--premiumColor)", editPost]);
          }
          dropdownButtons.unshift(["Delete", "#FF5C5C", deletePost]);
        } else {
          if (userID != null) {
            dropdownButtons.unshift(["Block User", "#FF8652", function() {
              blockUser(post.getAttribute("userid"), post.getAttribute("name"));
            }]);
            dropdownButtons.unshift(["Report", "#FFCB70", function() {
              reportContent(post.getAttribute("id"), post.getAttribute("name"), post.getAttribute("userid"), "post");
            }]);
            if (checkPermision(account.Role, "CanDeletePosts") == true) {
              dropdownButtons.unshift(["Ban User", "#FF5C5C", async function() {
                (await getModule("ban"))(post.getAttribute("userid"), post.getAttribute("name"))
              }]);
              dropdownButtons.unshift(["Delete", "#FF5C5C", deletePost]);
            } else {
              let groupID = getParam("group");
              if (currentPage == "group" && groups[groupID] != null && groups[groupID].Owner == userID) {
                dropdownButtons.unshift(["Delete", "#FF5C5C", deletePost]);
              }
            }
          }
        }
        showDropdown(button, "right", dropdownButtons);
      },
      sendchat: async function(button, post) {
        let premium = hasPremium();
        let limit = premium ? 400 : 200;
        if (userID == null) {
          promptLogin('Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style="color: var(--themeColor)">Chat</b> on a post!')
          return;
        }
        let renderChat = await getModule("chat");

        let text = post.querySelector(".postChatInput").textContent;
        post.querySelector(".postChatInput").textContent = "";
        if (text.length < 1) {
          showPopUp("Write a Chat", "You have to write... something.", [["Okay", "var(--grayColor)"]]);
          return;
        }
        if (text.length > limit) {
          if (limit == 200) {
            showPopUp("That's Too Long", `Please keep your chats to under ${limit} characters. However, with Photop Premium, you can send chats with up to 400 characters!`, [["Premium", "var(--premiumColor)", function() { setPage("premium"); }], ["Okay", "var(--grayColor)"]]);
            showPopUp("That's Too Long", `Please keep your chats to under ${limit} characters.`, [["Okay", "var(--grayColor)"]]);
          } else {
            showPopUp("That's Too Long", `Please keep your chats to under ${limit} characters.`, [["Okay", "var(--grayColor)"]]);
          }
          return;
        }
        let sendData = { text: text };
        let replyAdd = post.querySelector(".postChatReply");
        let previewData = { UserID: userID, PostID: post.id, Text: text, Timestamp: Date.now() };
        let replyData = null;
        if (replyAdd != null) {
          sendData.replyID = replyAdd.getAttribute("chatid");
          previewData.ReplyID = sendData.replyID;
          let repliedChat = findI(sendData.replyID);
          if (repliedChat != null) {
            replyData = { _id: repliedChat.id, user: { User: repliedChat.getAttribute("user") }, Text: repliedChat.getAttribute("text") };
            repliedChat.style.backgroundColor = "";
          } else {
            return;
          }
          replyAdd.remove();
        }
        post.querySelector(".loadingChatsInfo").style.display = "none";
        renderChat(post.querySelector(".chatHolder"), previewData, account, replyData, true);
        post.querySelector(".postChatHolder").scrollTo({
          top: post.querySelector(".postChatHolder").scrollHeight,
          behavior: "smooth"
        });
        let [code, response] = await sendRequest("POST", "chats/new?postid=" + post.id, sendData);
        if (code != 200) {
          let sendingChats = post.querySelectorAll("[sending='']");
          for (let i = 0; i < sendingChats.length; i++) {
            sendingChats[i].remove();
          }
          showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
        }
      },
      postlink: async function(elem) {
        showPost(elem.getAttribute("postid"));
      },
      imageenlarge: async function(elem) {
        let zoomedImageBlur = createElement("backBlur", "div", document.body);
        let zoomedImageHolder = createElement("zoomedImageHolder", "div", zoomedImageBlur);
        createElement("zoomedImage", "img", zoomedImageHolder).src = elem.src;
        createElement("zoomedImageClose", "div", zoomedImageHolder).innerHTML = "&times;";
        zoomedImageBlur.style.animation = "imageBlurIn 0.2s";
        zoomedImageBlur.style.opacity = 1;
        zoomedImageHolder.style.transform = "scale(1)";
        tempListen(zoomedImageBlur, "click", function(event) {
          zoomedImageBlur.style.opacity = 0;
          zoomedImageHolder.style.transform = "scale(0.9)";
          setTimeout(function() {
            event.target.closest(".backBlur").remove();
          }, 200);
        });
      },

      // Chat Actions:
      chat: async function(chat, post) {
        if(chat.getAttribute('editing') == "true")return;
        let dropdownButtons = [
          ["Copy Text", "var(--themeColor)", function() {
            copyClipboardText(chat.getAttribute("text"));
          }],
          ["Copy ID", "var(--themeColor)", function() {
            copyClipboardText("/Chat_" + chat.id);
          }]
        ];
        let mainElement;
        function editChat() {
          let currentEditing = document.querySelector(".chatText[contenteditable='true'], .chatMinfiyText[contenteditable='true']");
          if (currentEditing) {
            currentEditing.setAttribute("contenteditable", "false");
            currentEditing.innerHTML = formatText(currentEditing.getAttribute('originalText'));
            if(currentEditing.className == 'chatText'){
              currentEditing.parentElement.parentElement.setAttribute('editing', "false");
            }else{
              currentEditing.parentElement.setAttribute('editing', "false");
            }
            
            currentEditing.parentElement.querySelector('.editChatButtons').remove();
          }
          chat.setAttribute('editing', "true");
          mainElement = chat.querySelector(".chatText, .chatMinfiyText");
          mainElement.setAttribute("contenteditable", "true");
					mainElement.setAttribute("onpaste", "clipBoardRead(event)")
          mainElement.focus();
          const oldText = chat.getAttribute('text');
					const oldHTML = mainElement.innerHTML;
					mainElement.innerHTML = chat.getAttribute('text').replace(/@([^"]+)"([^"]+)"/g, "@$2");
          mainElement.setAttribute('originalText', oldText);

          const editButtonsContainer = createElement("editChatButtons", 'div', mainElement.parentElement);
          editButtonsContainer.innerHTML = `<button class="editChatButton saveEditButton" ${chat.className == "minifyChat"? "minified=\"defined\"":""}>Save</button><button class="editChatButton cancelEditButton" ${chat.className == "minifyChat"? "minified=\"defined\"":""}>Cancel</button>`;
          const editButtons = editButtonsContainer.querySelectorAll('.editChatButton');
          tempListen(editButtons[0], 'click', saveChat);
          tempListen(editButtons[1], 'click', () => {
            editButtonsContainer.remove();
            mainElement.setAttribute("contenteditable", "false");
            chat.setAttribute('editing', "false");
            chat.removeAttribute('originalText');
            mainElement.innerHTML = oldHTML;
          });

          tempListen(mainElement, 'keypress', enterChat);

          function enterChat(event){
            if (event.key == "Enter") {
              event.preventDefault();
              saveChat();
            }
          }
    
          async function saveChat(){
              mainElement.removeEventListener('keypress', enterChat);
              mainElement.style = 'color: #bbb';
              mainElement.setAttribute("contenteditable", "false");
              editButtonsContainer.remove();
              chat.setAttribute("type", "chat");
              chat.setAttribute("editing", "false");
              let [code, response] = await sendRequest("POST", `chats/edit?chatid=${chat.id} `, { text: mainElement.textContent });
              if (code != 200) {
                showPopUp("Error Editing Chat", response, [["Okay", "var(--themeColor)"]]);
                mainElement.textContent = oldText;
                editChat(chat, post);
              }
              mainElement.style = 'color: inherit;';
              chat.removeAttribute('originalText');
          }
        }

        function deleteChat() {
          showPopUp("Delete Chat?", "Are you sure you want to <b>permanently</b> delete this chat?", [["Delete", "#FF5C5C", async function() {
            chat.style.opacity = "0.5";
            let [code, response] = await sendRequest("DELETE", "chats/delete?chatid=" + chat.id);
            if (code != 200) {
              chat.style.opacity = "1";
              showPopUp("Error Deleting", response, [["Okay", "var(--grayColor)"]]);
            }
          }], ["Wait, no", "var(--grayColor)"]]);
        }
        if (chat.getAttribute("userid") == userID) {
          dropdownButtons.unshift(["Delete", "#FF5C5C", deleteChat]);
          if (hasPremium()) {
            dropdownButtons.unshift(["Edit Text", "var(--premiumColor)", editChat]);
          }
        } else {
          if (userID != null) {
            dropdownButtons.unshift(["Block User", "#FF8652", function() {
              blockUser(chat.getAttribute("userid"), chat.getAttribute("user"));
            }]);
            dropdownButtons.unshift(["Report", "#FFCB70", function() {
              reportContent(chat.getAttribute("id"), chat.getAttribute("user"), chat.getAttribute("userid"), "chat");
            }]);
            if (checkPermision(account.Role, "CanDeletePosts") == true) {
              dropdownButtons.unshift(["Ban User", "#FF5C5C", async function() {
                (await getModule("ban"))(chat.getAttribute("userid"), chat.getAttribute("user"));
              }]);
              dropdownButtons.unshift(["Delete", "#FF5C5C", deleteChat]);
            } else {
              let groupID = getParam("group");
              if (currentPage == "group" && groups[groupID] != null && groups[groupID].Owner == userID) {
                dropdownButtons.unshift(["Delete", "#FF5C5C", deleteChat]);
              }
            }
          }
        }
        dropdownButtons.unshift(["Reply", "#2AF5B5", function() {
          let newChatHolder = post.querySelector(".postChatNew");
          let prevReply = findC("postChatReply");
          if (prevReply != null) {
            let prevChat = findI(prevReply.getAttribute("chatid"));
            if (prevChat != null) {
              prevChat.style.backgroundColor = "";
            }
            prevReply.remove();
          }
          chat.style.backgroundColor = "#2AF5B5";
          let replyHolder = createElement("postChatReply", "div", newChatHolder);
          newChatHolder.insertBefore(replyHolder, newChatHolder.firstChild);
          replyHolder.setAttribute("chatid", chat.id);
          replyHolder.innerHTML = `<div class="postChatReplyLine"></div><div class="postChatReplyText">Replying to <b style="color: #FE5D6A">${chat.getAttribute("user")}</b></div><div class="postChatReplyClose" tabindex="0">&times;</div>`;
          replyHolder.querySelector(".postChatReplyClose").addEventListener("click", function() {
            chat.style.backgroundColor = "";
            replyHolder.remove();
          });
        }]);
        showDropdown(button, "left", dropdownButtons);
      },
      reply: async function(reply, post) {
        showChat(post.id, reply.getAttribute("replyid"));
      },
      chatlink: async function(elem) {
        showChat(null, elem.getAttribute("chatid"));
      },

      // Users:
      user: async function(clickElem) {
        showPreview(clickElem, clickElem.closest("[userid]").getAttribute("userid"));
      },
      follow: async function(followButton) {
        function updateFollow(type) {
          if (type == "follow") {
            followButton.textContent = "Unfollow";
            followButton.style.background = "#FF5C5C";
          } else {
            followButton.textContent = "Follow";
            followButton.style.background = "var(--themeColor)";
          }
        }
        if (followButton.textContent == "Follow") {
          updateFollow("follow");
          let [code] = await sendRequest("PUT", "user/follow?userid=" + followButton.getAttribute("userid"));
          if (code != 200) {
            updateFollow("unfollow");
          } else {
            updateFollow("follow");
          }
        } else {
          updateFollow("unfollow");
          let [code] = await sendRequest("DELETE", "user/unfollow?userid=" + followButton.getAttribute("userid"));
          if (code != 200) {
            updateFollow("follow");
          } else {
            updateFollow("unfollow");
          }
        }
      },

      // Groups:
      viewgroup: function(clickElem) {
        modifyParams("group", clickElem.closest("[id]").getAttribute("id"));
        setPage("group");
      },
      declineinvite: async function(clickElem) {
        let inviteTile = clickElem.closest("[id]");
        inviteTile.style.opacity = 0.5;
        let [code] = await sendRequest("DELETE", "groups/revoke?inviteid=" + inviteTile.getAttribute("id") + userID);
        if (code == 200) {
          inviteTile.remove();
        } else {
          inviteTile.style.opacity = 1;
        }
      },

      //Premium:
      giftlink: async function(elem) {
        (await getModule("gift"))(elem.getAttribute('giftid'));
      },
      claimgift: async function(elem){
        (await getModule("gift"))(elem.getAttribute("giftid"));
      }
    };
    if (actions[type] != null) {
      actions[type](button, button.closest(".post"));
    } else if (path[0].closest(".postPost") != null) {
      if (isMobile == false) {
        let postContent = path[0].closest(".postPost").querySelector(".postContent");
        if (postContent.hasAttribute("enlarged") == false) {
          modifyParams("post", postContent.closest(".post").id);
          let otherEnlargedPost = pageHolder.querySelector(".postContent[enlarged='']");
          if (otherEnlargedPost != null) {
            otherEnlargedPost.style.removeProperty("height");
            otherEnlargedPost.removeAttribute("enlarged");
            let postChatHolder = otherEnlargedPost.closest(".post").querySelector(".postChatHolder");
            postChatHolder.scrollTo({
              top: postChatHolder.scrollHeight
            });
          }
          postContent.style.height = "300px";
          postContent.setAttribute("enlarged", "");
        } else {
          modifyParams("post");
          postContent.style.removeProperty("height");
          postContent.removeAttribute("enlarged");
          let postChatHolder = path[0].closest(".post").querySelector(".postChatHolder");
          postChatHolder.scrollTo({
            top: postChatHolder.scrollHeight
          });
        }
      } else {
        openMobilePostView(path[0].closest(".post"));
      }
    }
  });
}