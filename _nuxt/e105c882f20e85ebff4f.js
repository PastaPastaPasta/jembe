(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{1576:function(t,e,n){"use strict";n(19),n(14),n(12),n(7),n(17),n(125);var r=n(6),o=n(3),l=n(216);function c(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function v(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var d={name:"Tweet",props:{jam:Object},computed:v(v({},Object(l.c)(["getJams"])),{},{userIdLink:function(){return"http://console.dashevo.io/#/platform/FiBkhut4LFPMJqDWbZrxVeT6Mr6LsH3mTNTSSHJY2ape?showcontract=false&querydocs=true&type=domain&queryopts="+encodeURIComponent(JSON.stringify({limit:1,startAt:1,where:[["$id","==",this.jam.userId]]}))}}),mounted:function(){},methods:v(v({},Object(l.b)(["likeJam","countLikes","followJammer","showSnackbar","sendDash"])),{},{showLoginNag:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.$store.getters.hasDelegatedCredentials){e.next=3;break}return e.next=3,t.showSnackbar({color:"green",text:"Please login first."});case 3:case"end":return e.stop()}}),e)})))()},tip:function(i){console.log("tipping i",i),this.sendDash({amount:1e4})},date:function(t){return new Date(1e3*t)},follow:function(i){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.getJams,r=n[i].userId,o=!t.$store.state.follows[r],console.log("isFollowing :>> ",o),e.next=6,t.showSnackbar({text:"Following: ".concat(o),color:"green"});case 6:return e.next=8,t.followJammer({jammerId:r,isFollowing:o});case 8:case"end":return e.stop()}}),e)})))()},like:function(i){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.getJams,r=n[i].$id,o=!n[i].iLiked.isLiked,e.next=5,t.likeJam({jamId:r,isLiked:o});case 5:return e.next=7,t.countLikes({jamId:r});case 7:case"end":return e.stop()}}),e)})))()}})},m=n(144),f=n(260),_=n.n(f),w=n(425),h=n(1575),C=n(1574),y=n(410),k=n(329),x=n(255),V=n(414),j=n(143),I=n(1616),L=n(1571),component=Object(m.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-card",{staticClass:"my-2 mx-auto",attrs:{"max-width":"600"}},[r("v-card-title",[r("v-list-item-avatar",{attrs:{color:"grey darken-3"}},[r("v-img",{staticClass:"elevation-6",attrs:{src:n(644)}})],1),t._v(" "),r("v-list-item-content",[r("v-list-item-title",{staticStyle:{color:"#008de4"}},[r("a",{staticStyle:{color:"#008de4","text-decoration":"none","font-size":"1rem","align-self":"center","font-weight":"500","letter-spacing":"0.0125em","line-height":"1.1"},attrs:{href:t.userIdLink,target:"_blank"},on:{click:function(t){t.stopPropagation()}}},[t._v("\n          "+t._s(t.jam.userName)+"\n        ")])]),t._v(" "),r("timeago",{staticClass:"subtitle-1",attrs:{datetime:t.date(t.jam.timestamp),"auto-update":60}})],1)],1),t._v(" "),r("v-card-text",{staticClass:"subtitle-1"},[t._v("\n    "+t._s(t.jam.text)+"\n  ")]),t._v(" "),r("v-card-actions",{on:{click:function(e){return t.showLoginNag()}}},[r("v-list-item",{staticClass:"grow"},[r("v-row",{attrs:{align:"center",justify:"end"}},[r("v-btn",{attrs:{text:"",disabled:!t.$store.getters.hasDelegatedCredentials},on:{click:function(e){return e.stopPropagation(),t.follow(t.$vnode.key)}}},[t._v(t._s(t.$store.getters.getFollows[t.jam.userId]?"Following":"Follow")+"\n        ")]),t._v(" "),r("v-spacer"),t._v(" "),r("v-icon",{staticClass:"mr-1"},[t._v("mdi-twitter-retweet")]),t._v(" "),r("span",{staticClass:"subheading mr-2"},[t._v("3")]),t._v(" "),r("span",{staticClass:"mr-1"},[t._v("·")]),t._v(" "),r("v-icon",{staticClass:"mr-1",attrs:{color:t.jam.iLiked.isLiked?"#008de4":"",disabled:!t.$store.getters.hasDelegatedCredentials},on:{click:function(e){return e.stopPropagation(),t.like(t.$vnode.key)}}},[t._v(t._s(t.jam.iLiked.isLiked?"mdi-heart":"mdi-heart-outline"))]),t._v(" "),r("span",{staticClass:"subheading mr-2"},[t._v(t._s(t.jam.likes))]),t._v(" "),r("span",{staticClass:"mr-1"},[t._v("·")]),t._v(" "),r("v-icon",{staticClass:"mr-1",attrs:{disabled:!t.$store.getters.hasDelegatedCredentials},on:{click:function(e){return e.stopPropagation(),t.tip(t.$vnode.key)}}},[t._v("$dash\n        ")]),t._v(" "),r("span",{staticClass:"mr-1"},[t._v("·")]),t._v(" "),r("v-icon",{staticClass:"mr-1"},[t._v("mdi-share-variant")]),t._v(" "),r("span",{staticClass:"subheading"},[t._v("45")])],1)],1)],1)],1)}),[],!1,null,null,null);e.a=component.exports;_()(component,{VBtn:w.a,VCard:h.a,VCardActions:C.a,VCardText:C.b,VCardTitle:C.c,VIcon:y.a,VImg:k.a,VListItem:x.a,VListItemAvatar:V.a,VListItemContent:j.a,VListItemTitle:j.c,VRow:I.a,VSpacer:L.a})},1584:function(t,e,n){t.exports=n.p+"img/bf0ee71.png"},1586:function(t,e,n){"use strict";var r={name:"Usercard",props:{isFollowed:Boolean}},o=n(144),l=n(260),c=n.n(l),v=n(425),d=n(1575),m=n(1574),f=n(410),_=n(329),w=n(255),h=n(143),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-card",{staticClass:"mx-auto my-2",attrs:{"max-width":"280"}},[r("v-img",{attrs:{src:n(1584),height:"194"}}),t._v(" "),r("v-list-item",[r("v-list-item-content",[r("v-list-item-title",{staticClass:"headline"},[t._v("Bob"),r("v-btn",{staticClass:"mb-1",staticStyle:{float:"right"},attrs:{color:"primary",elevation:"0",outlined:!t.isFollowed,dense:"",rounded:""}},[t._v(t._s(t.isFollowed?"Following":"Follow"))])],1),t._v(" "),r("v-list-item-subtitle",[t._v("Bob's fancy status update")])],1)],1),t._v(" "),r("v-card-text",{staticClass:"subtitle-1"},[r("p",[r("v-icon",[t._v("mdi-calendar-month")]),t._v(" Joined May 2017")],1),t._v(" "),r("p",[r("span",{staticStyle:{"font-weight":"bold"}},[t._v("5")]),t._v(" Following\n      "),r("span",{staticClass:"ml-2",staticStyle:{"font-weight":"bold"}},[t._v("47")]),t._v(" Followers\n    ")])])],1)}),[],!1,null,null,null);e.a=component.exports;c()(component,{VBtn:v.a,VCard:d.a,VCardText:m.b,VIcon:f.a,VImg:_.a,VListItem:w.a,VListItemContent:h.a,VListItemSubtitle:h.b,VListItemTitle:h.c})},1624:function(t,e,n){"use strict";n.r(e);var r=n(1576),o=n(1586),l={components:{Tweet:r.a,Usercard:o.a}},c=n(144),v=n(260),d=n.n(v),m=n(425),f=n(1575),_=n(1574),w=n(1626),h=n(410),C=n(329),y=n(255),k=n(143),x=n(1617),V=n(1625),j=n(1622),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",{staticStyle:{maxwidth:"700px"}},[r("v-card",{staticClass:"my-2",attrs:{flat:""}},[r("v-img",{attrs:{src:n(644),height:"194"}}),t._v(" "),r("v-list-item",[r("v-list-item-content",[r("v-list-item-title",{staticClass:"headline"},[t._v(t._s(this.$store.state.name.label)),r("v-btn",{staticClass:"mb-1",staticStyle:{float:"right"},attrs:{color:"primary",elevation:"0",outlined:"",dense:"",rounded:""}},[t._v("Set up Profile")])],1),t._v(" "),r("v-list-item-subtitle",[t._v("Sending good vibes and a couple of duff.")])],1)],1),t._v(" "),r("v-card-text",{staticClass:"subtitle-1"},[r("p",[r("v-icon",[t._v("mdi-calendar-month")]),t._v(" Joined May 2017")],1),t._v(" "),r("p",[r("span",{staticStyle:{"font-weight":"bold"}},[t._v("5")]),t._v(" Following\n        "),r("span",{staticClass:"ml-2",staticStyle:{"font-weight":"bold"}},[t._v("47")]),t._v(" Followers\n      ")])])],1),t._v(" "),r("v-tabs",{attrs:{"fixed-tabs":""}},[r("v-tab",[t._v("\n      Tweets\n    ")]),t._v(" "),r("v-tab",[t._v("\n      Following\n    ")]),t._v(" "),r("v-tab",[t._v("\n      Followers\n    ")]),t._v(" "),r("v-tab",[t._v("\n      Likes\n    ")]),t._v(" "),r("v-tab-item"),t._v(" "),r("v-tab-item",[r("v-container",{staticStyle:{maxwidth:"600px",display:"flex"},attrs:{fluid:""}},[r("Usercard",{attrs:{"is-followed":""}})],1)],1),t._v(" "),r("v-tab-item",[r("v-card",{attrs:{flat:"",tile:""}},[r("v-container",{staticStyle:{maxwidth:"600px",display:"flex"},attrs:{fluid:""}},[r("Usercard",{attrs:{"is-followed":""}})],1)],1)],1),t._v(" "),r("v-tab-item")],1)],1)}),[],!1,null,null,null);e.default=component.exports;d()(component,{VBtn:m.a,VCard:f.a,VCardText:_.b,VContainer:w.a,VIcon:h.a,VImg:C.a,VListItem:y.a,VListItemContent:k.a,VListItemSubtitle:k.b,VListItemTitle:k.c,VTab:x.a,VTabItem:V.a,VTabs:j.a})}}]);