var modalInIsOpen = false
$('.signInModal').on('shown.bs.modal', function(e) { 
	modalInIsOpen = true;
});
$('.signInModal').on('hidden.bs.modal', function(e) { 
	clearUserInput();
	modalInIsOpen = false;
});

var modalUpIsOpen = false;
$('.signUpModal').on('shown.bs.modal', function(e) { 
	modalUpIsOpen = true;
});
$('.signUpModal').on('hidden.bs.modal', function(e) {
	clearUserInput();
	modalUpIsOpen = false;
});

function clearUserInput(){
	$('.in-error-message').html("");
	$('.in-email-input').val("");
	$('.in-password-input').val("");
	$('.up-error-message').html("");
	$('.up-email-input').val("");
	$('.up-password-input').val(""); 
}

function noAccount(){
	$(".userIdP").css("display", "none");
	$(".userIdP").html("");
	$(".signOutButton").css("display","none");
	$(".signInButton").css("display","inline-block");
	$(".signUpButton").css("display","inline-block");
	$("#getMyRecipesButton").css("display", "none");
}

var file_id;

function signUp(authorization){
	$(".signUpSubmitButton").on("click", function(){
		file_id = $(this).data("file-id");
		var email = $("#up-email-input-" + file_id).val();
		var password = $("#up-password-input-" + file_id).val();
		if(authorization.currentUser){
			console.log("a user is already signed in, cannot sign up");
			$("#up-error-message-" + file_id).text("A user is already logged on, you must sign out to sign up");
		} else{
			authorization.createUserWithEmailAndPassword(email, password).catch(function(error) {
				console.log("Could not sign up");
				$("#up-error-message-" + file_id).text(error.message);
			});
		}
  });
}

function signIn(authorization){

	$(".signInSubmitButton").on("click", function(){
		file_id = $(this).data("file-id");
		var email = $("#in-email-input-" + file_id).val();
		var password = $("#in-password-input-" + file_id).val();
		if(authorization.currentUser){
			console.log("a user is already signed in, cannot sign up");
			$("#in-error-message-" + file_id).text("A user is already logged on, you must sign out to sign up");
		} else{
			authorization.signInWithEmailAndPassword(email, password).catch(function(error){
				console.log("Could not log in: " + error.code);
				$("#in-error-message-" + file_id).text(error.message);
			});
		}
	});
}

function signOut(authorization){
	$(".signOutButton").on("click", function(){
		authorization.signOut();
	});
}

function authStateChanged(authorization, wholeDb){
	authorization.onAuthStateChanged(function(myUser){
		if(myUser){
			if(!myUser.isAnonymous){
				var usersRef = wholeDb.ref("usersInfo/");
				usersRef.once("value", function(snap){
					if(!(snap.hasChild(myUser.uid))){
						var userRef = wholeDb.ref("usersInfo").child(myUser.uid);
						userRef.set({
							state: {length:0},
						});
					}
				});
				console.log(myUser);
				console.log(myUser.email + " is signed in ");
				if(modalInIsOpen){
					clearUserInput();
					$("#signInModal-" + file_id).modal("hide");
				}
				if(modalUpIsOpen){
					clearUserInput();
					$("#signUpModal-" + file_id).modal("hide");
				}
				if(myUser.displayName){
					$(".userIdP").text(myUser.displayName);
				} else {
					$(".userIdP").text(myUser.email);
				}
				$(".userIdP").css("display", "inline-block");
				$(".signOutButton").css("display","inline-block");
				$(".signInButton").css("display","none");
				$(".signUpButton").css("display","none");
				$("#getMyRecipesButton").css("display", "inline-block");
			} else {
				console.log("a user is signed in anonymously with uid: " + myUser.uid);
				noAccount();
			}
		} else {
			console.log("a user is not logged in");
			noAccount();
		}
	});
}

module.exports = {
  signUp,
  signIn,
  signOut,
  authStateChanged
};

