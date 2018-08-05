$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB5w4kD4fczy7qVSDvoZLv8ks7UK3O8-ps",
        authDomain: "poo-review-4f8c8.firebaseapp.com",
        databaseURL: "https://poo-review-4f8c8.firebaseio.com",
        projectId: "poo-review-4f8c8",
        storageBucket: "",
        messagingSenderId: "884187524701"
      };
    firebase.initializeApp(config);

    var database = firebase.database();

    var zip     = "";
    var name    = "";
    var comments = [];
    var ratings = {   
            recommend: 0,
            oppose:    0,
            clean:     0,
            dirty:     0,
            ok:        0,
    }

    // FIXME
    // RETRIEVE ZIP & DISPLAY
    // $("#display-zip").text(sessionStorage.getItem("zip"))

    $("li").on("click", function() {
        var $this = $(this);
        var $ratingWord = $this.find("span").text().trim().toLowerCase();
        $this.addClass("purple-text text-darken-2");
        $this.siblings().removeClass("purple-text text-darken-2");

        switch ($ratingWord) {
            case "glorious":
                ratings.recommend = 1;
                ratings.oppose = 0;
                break;
            case "crappy":
                ratings.oppose = 1;
                ratings.recommend = 0;
                break;
            case "clean":
                ratings.clean = 1;
                ratings.dirty = 0;
                ratings.ok = 0;
                break;
            case "grimey":
                ratings.clean = 0;
                ratings.dirty = 1;
                ratings.ok = 0;
                break;
            case "ok":
                ratings.clean = 0;
                ratings.dirty = 0;
                ratings.ok = 1;
                break;
        }
    })

    // //  RETRIEVE BUSINESSES BY ZIP
    // var businessRef = database.ref("business");
    // businessRef.orderByChild("zip").equalTo(sessionStorage.getItem("zip")).once("value", function(snapshot) {
    //     // console.log(snapshot.val());
    //     var obj = snapshot.val();
    //     Object.keys(obj).forEach(function(element) {
    //         console.log(obj[element].name);
    //         if (name === obj[element].name) {
    //             console.log("Business Match!")
    //         }
    //     })
        
    //     // console.log(snapshot.key);
    // });

    // //  GENERATE LIST OF COMMENTS SORTED BY ZIP AND BUSINESS
    // var businessRef = database.ref("business");
    //     businessRef.orderByChild("zip").equalTo(sessionStorage.getItem("zip")).once("value", function(snapshot) {
    //         // console.log(snapshot.val());
    //         var obj = snapshot.val();
    //         Object.keys(obj).forEach(function(element) {
    //             console.log(obj[element].name);
    //             if ("walmart" === obj[element].name) {
    //                 console.log("Business Match!")
    //                 obj[element].comments.forEach(function(element) {
    //                     console.log(element);
    //                 })
    //             }
    //         })
    //     });

    // SUBMIT REVIEW
    $("#submit-btn").on("click", function() {
        zip = $("#z-input").val();
        name = $("#business").val();
        var commentField = $(".comments").val();

        if (commentField.length > 0) {
            comments.push($(".comments").val());
        }

        //  COMPARE ALL BUSINESSES TO BUSINESS INPUT
        var businessRef = database.ref("business");
        businessRef.once('value', function(snapshot) {
            console.log(snapshot.val())
            var businessLocationExists = false;
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                // console.log(childKey);
                // console.log(childData.name);
                if ((name === childData.name) && (zip === childData.zip)) {
                    var str = comments.toString();
                    // console.log(str);
                    businessLocationExists = true;
                    // console.log("Business Match!")
                    // console.log(childData.name + " zip: " + childData.zip)
                    // console.log(childKey);
                    // console.log(childData);
                    // console.log(childData.comments);
                    database.ref(`/business/${childKey}/ratings`).update({
                        recommend: ratings.recommend + childData.ratings.recommend,
                        oppose:    ratings.oppose + childData.ratings.oppose,
                        clean:     ratings.clean + childData.ratings.clean,
                        dirty:     ratings.dirty + childData.ratings.dirty,
                        ok:        ratings.ok + childData.ratings.ok,
                    });
                    if (commentField.length > 0) {
                        database.ref(`/business/${childKey}`).update({
                            comments
                        });
                    }
                }
            });
            if (businessLocationExists === false) {
                database.ref("/business").push({
                    zip, name, comments, ratings
                });
                console.log("pushed new location");
            }
        });

    });
    
});//End of document.ready function