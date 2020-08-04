function crea_libelle(A_couleur,A_legence,type){
	
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	div_parent_simul = "simul_"+simulation_hover;
	
	txt_htm = "";

	for(var i= 0; i < A_couleur.length; i++){
		txt_htm += "<p class='legende'><span style='background-color:#"+A_couleur[i]+"'></span>"+A_legence[i]+"</p>";
	}

	$("#simul_"+simulation_hover+" ."+type+" .legende").html(txt_htm);
}


$("#simulateur-achylles").on("mouseover",".info_bulle",function(e){ 
	titre = $(this).data("title");
	$(this).data("title","");

	pos_y = e.pageY + 18;
	pos_x = e.pageX;

	$("body").append("<div class='bulle_aide' style='top:"+pos_y+"px;left:"+pos_x+"px'>"+titre+"</div>");
	$(".bulle_aide").hide();
		
	pos_x -= $(".bulle_aide").width()/2;
		
	$(".bulle_aide").css("left",pos_x+"px");

		
	$(".bulle_aide").fadeIn(400);

	return false;
});

$("#simulateur-achylles").on("mouseout",".info_bulle",function(e){
	$(this).data("title",titre);
	$(".bulle_aide").remove();
});

var chemin_repertoire_defaut = "/credit-immobilier/formulaire-mob/";
	
$("#simulateur-achylles").on("click","#btp_comparer",function(){ 
	code = $(this).data("code");
	mot_cle = $(this).data("mot_cle");
	act = $(this).data("act");
	
	ga('send', 'event', 'CTA', 'Comparer immo', mot_cle, {nonInteraction: false});
	
	if(code != ""){
	
		url_champ = "act="+act+"&code="+code+"&popup=1&redirect=1&mot_cle="+mot_cle;
		url_file = chemin_repertoire_defaut+"ajax_cal.php";

		$.ajax({
			type: "POST",
			url: url_file,
			data: url_champ,
			success: function(Ajax_redir){
				
				objJson = JSON.parse(Ajax_redir);

				if(objJson.lien){
					
					if(code == "SEMPSL"){
						window.open(objJson.lien,"Formulaire");
					}
					else{
						window.location.href = objJson.lien;
					}
				}
				
			}
		});	
	}
});	

$("#onglet_simulations").on("click",".supp",function(e){ 
	e.preventDefault();
	num_simulation = $(this).data("supp");
	
	suppcredit(num_simulation);
});

$("#btp_retour_sommaire").click(function(){
	code = $(this).data("code");

	if(code != ""){
		window.location.href = "../index.php?code="+code+"&page=calcul";
	}			
});	





function lectnb(si) {
 var result="";
 for (var pi=0;pi<si.length;pi++) {
  var ci=si.charAt(pi);
  if ((ci!="0")||(result!=""))
   if (ci>="0" && ci<="9")
    result+=ci
   else if ((ci==",")||(ci=="."))
    result+="."
   else if ((ci=="-")&&(result==""))
    result+="-";
 }
 if (result=="") result="0";
 return result;
}

function strtofloat(sf) {
 return parseFloat(lectnb(sf));
}

function strtoint(si) {
 return parseInt(lectnb(si));
}

$("#onglet_simulations").on("click","span",function(e){
	e.preventDefault();
	num_simulation = $(this).parent().data("simulation");
	
	if(num_simulation == "ajout"){

		//nb_simulation = $("[id^='onglet_simul_']").length;

		ajout_simulation_html();
	}
	else{
		aff_onglet(this,num_simulation);
	}
});	
/*
function onglet_result_txt(){
	
	type_cal = obj_critere_form.act;
	
	if(type_cal == "calcul_endettement"){
		txt_aff_onglet = 'Taux endettement : <span class="result_endettement"></span>';
	}
	
	return txt_aff_onglet;
}*/


function focus_on(name_input){
	onglet = obj_critere_form.simulation_encours;

	$("#simul_"+onglet+" input[name='"+name_input+"']").focus();
}


function suppcredit(element){

	$("#onglet_simul_"+element).remove();
	$("#simul_"+element).remove();

	simulation_total = obj_critere_form.simulation_total;
	
	simulation_total--;

	obj_critere_form.simulation_encours = 1;
	obj_critere_form.simulation_total = simulation_total;
		
	obj_critere_form.enregistrement_champ("simulation_encours",1);
	obj_critere_form.enregistrement_champ("simulation_total",simulation_total);

	aff_onglet("",1);
	$(".ajout").show();
}



function valid_char(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode;
	
	if (charCode == 13) {
		mortgage_function();
	}
}

function transforme_content_html(content_html){
	
	new_simulation = obj_critere_form.simulation_total_cree;

	content_html = content_html.replace(/_1/g,'_'+new_simulation);
	//content_html = content_html.replace('id="vue_graphique_1"','id="vue_graphique_'+new_simulation+'"');

	return content_html;
}

function taille_div_global_cal(element){
	var dstWindow = window.parent;
	//alert($(element).height());
	dstWindow.postMessage($(element).height()+15, '*');
}

function aff_onglet(element,num){

	if(num != ""){
		id_onglet = "onglet_"+num;
	}
	else{
		id_onglet = element.id;
	}

	obj_critere_form.enregistrement_champ("simulation_encours",num);
		
	if($("#simul_"+num) && $("#simul_"+num).is(":hidden")){	
		$("[id^='simul_']").hide();
		$("[id^='onglet_simul_']").removeClass("visu_on");
		$("[id^='onglet_simul_']").addClass("visu_off");

		$("#simul_"+num).show();		
		$("#onglet_simul_"+num).removeClass("visu_off");
		$("#onglet_simul_"+num).addClass("visu_on");			
	}
}
	
function ecran_taille(){

	var A_ecran = new Array(); 
	
	A_ecran["w"] = document.body.clientWidth;
	A_ecran["h"]  = document.body.clientHeight;

	return A_ecran;
}

function cal_taille(){
	return $("#simulateur-achylles").width();
}

function aff_montant(nom_champ){
	simulation_hover = obj_critere_form.simulation_encours;
	div_parent_simul = "simul_"+simulation_hover;

	val = $("#"+div_parent_simul+" input[name='"+nom_champ+"']").val();

	val = sup_espace_montant(val);

	if(val == 0){
		val = ""; 
	}
	
	$("#"+div_parent_simul+" input[name='"+nom_champ+"']").val(val);

}

function sup_espace_montant(var_champ){

	var var_champ;
	
	if(var_champ != ""){
		var_champ = var_champ+"";
		while(var_champ.indexOf(' ')>0){
			var_champ=var_champ.replace(' ','');
		}
	}
	return var_champ;
}

function aff_montant_sep(nom_champ,montant) {
	
	simulation_hover = obj_critere_form.simulation_encours;
	div_parent_simul = "simul_"+simulation_hover;
	
	if(nom_champ!=""){
		
		val_champ = $("#"+div_parent_simul+" input[name='"+nom_champ+"']").val();

		if(val_champ.indexOf('.')>0 || val_champ.indexOf(',')>0){
			src = Math.ceil(val_champ);
		}
		else if(val_champ.indexOf(' ')>0){

			src = ""+val_champ+"";

			src = sup_espace_montant(src);
		}
		else {
			src = val_champ;
		}
	}
	else{
		src = ""+Math.ceil(parseInt(sup_espace_montant(montant)))+"";
	}

	avec_sep_p=separateur_p="";

	if(src.length<4){avec_sep_p=src;}

	while(src.length>3){

		avec_sep_p=src.substr(src.length-3,src.length)+separateur_p+avec_sep_p;

		src=src.substr(0,src.length-3);

		if(avec_sep_p!=""){separateur_p=' ';}

		if(src.length<=3){avec_sep_p=src+separateur_p+avec_sep_p;}
	}

	if(avec_sep_p == ""){avec_sep_p = 0}

	if(nom_champ!=""){
		$("#"+div_parent_simul+" input[name='"+nom_champ+"']").val(avec_sep_p);
	}
	else{
		return avec_sep_p;
	}
}

function focus_css(type_champ,element,etat){

	simulation_hover = obj_critere_form.simulation_encours;
	div_parent_simul = "simul_"+simulation_hover;

	if(element.id){	
		element_id = element.id;
	}
	else{
		
		element_id = element;
	}

	if(type_champ == "select"){
		$("#"+div_parent_simul+" #"+element_id).parent().removeClass("err_select_on");
		$("#"+div_parent_simul+" #"+element_id).parent().removeClass("select_on");
		
		if(etat == 0){
			$("#"+div_parent_simul+" #"+element_id).parent().addClass("err_select_on");
		}
		else if(etat == 1){
			$("#"+div_parent_simul+" #"+element_id).parent().addClass("select_on");
		}
	}
	else{

		id_parent = $("#"+div_parent_simul+" #"+element_id).parent();
		
		class_css = id_parent.attr("class");
		
		A_css = class_css.split(" ");
		
		for(i=0;i<A_css.length;i++ ){
			
			if(A_css[i].indexOf("nput_") > 0){
				style_a_modif = A_css[i];
				
				style_a_modif = style_a_modif.replace("_on","");
				style_a_modif = style_a_modif.replace("_err","");
				
				id_parent.removeClass(A_css[i]);	
			}	
		}

		if(etat == 0 && style_a_modif){
			id_parent.addClass(style_a_modif+"_err");	
		}
		else if(etat == 1 && style_a_modif){
			id_parent.addClass(style_a_modif+"_on");
		}
	}
}

function aff_erreur(element,txt_erreur){
	simulation_hover = obj_critere_form.simulation_encours;
	div_parent_simul = "simul_"+simulation_hover;

	$("#"+div_parent_simul+" #cont_"+element.id+" .err_champ").remove();
	
	$("#"+div_parent_simul+" #cont_"+element.id).append("<span class='err_champ'>"+txt_erreur+"</span>");
}

function taille_div_global(element){

	var dstWindow = window.parent;

	//alert($(element).height());

	dstWindow.postMessage($(element).height()+15, '*');
}

/*
function sup_val_zero(contenu_champ,nom_champ){

	contenu_champ = sup_espace_montant(contenu_champ);

	if(contenu_champ == 0){
		 $("input[name='"+nom_champ+"']").val("");
	}
}*/

function sup_err(element){
	simulation_hover = obj_critere_form.simulation_encours;
	div_parent_simul = "simul_"+simulation_hover;
	
	$("#"+div_parent_simul+" #cont_"+element.id+" .err_champ").remove();
}

function blur_recup_val(nom_champ,return_val){
	
	simulation_hover = obj_critere_form.simulation_encours;
	div_parent_simul = "simul_"+simulation_hover;
	
	validation = 0;
	
	champ_type_val =$("#"+div_parent_simul+" input[name='"+nom_champ+"']").data("type");
	champ_ob =$("#"+div_parent_simul+" input[name='"+nom_champ+"']").data("ob");
	
	valeur_montant = $("#"+div_parent_simul+" input[name='"+nom_champ+"']").val();

	if(champ_type_val == "montant" || champ_type_val == "taux"){
		if(nom_champ != ""){
			valeur_montant = $("#"+div_parent_simul+" input[name='"+nom_champ+"']").val();
			
			if(valeur_montant == ""){
				$("#"+div_parent_simul+" input[name='"+nom_champ+"']").val(0);
				valeur_montant = 0;
			}
		}
		else{
			valeur_montant = return_val;
		}
	}


	//champ_type_val =$("#"+div_parent_simul+" input[name='"+nom_champ+"']").data("type");

	if(champ_type_val == "montant"){
		choix_test = "MONTANT";
	}
	else if(champ_type_val == "taux"){
		choix_test = "TAUX";
	}
	else if(champ_type_val == "ville_cp"){
		choix_test = "ville_CP";
	}
	else if(champ_type_val == "e_mail"){
		choix_test = "E_MAIL";
	}

	choix_test_ob="";
	
	if(champ_ob != 1){
		choix_test_ob = "_nob";
	}
	
	choix_test = choix_test+choix_test_ob;
		
	validation =  blur_champ_num(valeur_montant,choix_test);

	return validation;
}

function blur_champ_num(contenu_champ,test_choix){

	var var_return=0;

	if(test_choix=="CP"){
		var reg=new RegExp("^[0-9]{5}$","gi");

		if (reg.test(contenu_champ)==true){
			var_return=1;
		}
	}

	if(test_choix=="ville_CP"){

		if(contenu_champ.length>2){ 
			var reg=new RegExp("^[0-9]{2,5}|^(.*){2,50}$","gi");

			if (reg.test(contenu_champ)==true){var_return=1;}
		}
		else{
			var_return=0;
		}
	}
	
	if(test_choix=="CP1"){

		if(contenu_champ.length>2){ 

			var reg=new RegExp("^[0-9]{3,5}$","gi");

			if (reg.test(contenu_champ)==true){var_return=1;}
		}
		else{
			var_return=0;
		}
	}
	
	if(test_choix=="MONTANT"){

		contenu_champ=sup_espace_montant(""+contenu_champ+"");

		var reg=new RegExp("^[0-9]{1,15}$","gi");

		if (reg.test(contenu_champ)==true && contenu_champ>0){
			var_return = 1;
		}
	}
	
	if(test_choix=="MONTANT_nob"){

		contenu_champ=sup_espace_montant(""+contenu_champ+"");

		var reg=new RegExp("^[0-9]{0,15}$","gi");

		if (reg.test(contenu_champ)==true || contenu_champ==0){
			var_return=1;
		}
	}

	if(test_choix=="DATE_Y"){
		contenu_champ=sup_espace_montant(""+contenu_champ+"");

		var reg=new RegExp("^[1-2][0-9]{3}$","gi");

		if (reg.test(contenu_champ)==true && contenu_champ>0){
			var_return=1;
		}
	}

	if(test_choix=="TAUX"){

		contenu_champ=sup_espace_montant(""+contenu_champ+"");
		var reg=new RegExp("^[0-9]+([.,][0-9]{1,2})?$","gi");
		if (reg.test(contenu_champ)==true){
			var_return=1;
		}
	}
	
	if(test_choix=="TAUX_nob"){
		contenu_champ=sup_espace_montant(""+contenu_champ+"");
		var reg=new RegExp("^[0-9]+([.,][0-9]{1,2})?$","gi");
		if (reg.test(contenu_champ)==true || contenu_champ==0){
			var_return=1;
		}
	}
	
	
	if(test_choix=="E_MAIL" || test_choix=="E_MAIL_nob"){
		var reg = new RegExp('^([-0-9A-Za-z._]{2,})+@([-0-9A-Za-z.]{2,})+([.]{1})+([A-Za-z]{2,4})$', 'i');

		if (reg.test(contenu_champ)==true){
			var_return = 1;
		}
	}

	return var_return;
}

function couleur_hab_graph(couleur,couleur2){
	var A_couleur = new Array("0faad2","f6aa26","326580");

	if(couleur == "01af8a"){ // gdc
		A_couleur = new Array("01af8a","b1005a","008165");	
	}
	else{
		
		if(couleur != "" && couleur != "FFFFFF"){
			A_couleur[0] = couleur;
		}
		if(couleur2 != "" && couleur2 != "FFFFFF"){
			A_couleur[1] = couleur2;
		}
	}
	return A_couleur;
}

function inttostr(i){

 var result="";

 i = Math.round(parseFloat(i));
 si = i.toString();
 if (isNaN(si)) si="0";
 bi = 0;
 
 for (pi=si.length-1;pi>=0;pi--) {
	ci = si.charAt(pi);
	if ((bi==0)&&(pi!=si.length-1)&&(ci!="-")) {
		result=ci+" "+result;
	} 
	else {
		result=ci+result;
	}
	bi=(bi+1)%3;
 }
 return result;
}

function sup_espace_montant(var_champ){
	var var_champ;
	
	var_champ= var_champ+"";
	
	if(var_champ != ""){
		while(var_champ.indexOf(' ')>0){
			var_champ=var_champ.replace(' ','');
		}
	}
	
	return var_champ;
}

function number_format_aff(montant) {
	src=""+Math.ceil(parseInt(montant))+"";

	avec_sep_p=separateur_p="";
	
	if(src.length<4){avec_sep_p=src;}

	while(src.length>3){
		avec_sep_p=src.substr(src.length-3,src.length)+separateur_p+avec_sep_p;
		src=src.substr(0,src.length-3);
		if(avec_sep_p!=""){separateur_p=' ';}
		if(src.length<=3){avec_sep_p=src+separateur_p+avec_sep_p;}
	}
	
	if(avec_sep_p == ""){avec_sep_p = 0}
	
	return avec_sep_p;	
}

function calcul_frais_notaire(montant_bien,idnature,departement){
	
	A_departement = new Array(36,38,53,56);
	A_frais_notaire = new Array();
	A_p_frais_notaire = new Array();
	
	A_frais_notaire["frais_de_debours"] = 1250;
	
	if (idnature == 1 || idnature == 3 || idnature == 7 || idnature == 8 || idnature == 9){ // neuf
		A_frais_notaire["droits_taxes"] = (montant_bien*0.715)/100;
	}
	if (idnature == 2 || idnature == 4 || idnature == 5 || idnature == 6 || idnature ==  10){ // ancien
		
		if(departement != "" && contains(A_departement,departement) == true){
			A_frais_notaire["droits_taxes"] = (montant_bien*5.09)/100;
		}
		else{
			A_frais_notaire["droits_taxes"] = (montant_bien*5.80665)/100;
		}
		
		
	}
	
	// Salaire du conservateur des hypothÃ¨ques
	A_frais_notaire["droits_taxes"] += (montant_bien*0.1)/100;
	
	
	A_T_taux = new Array(0,3.95,1.627,1.085,0.814);
	A_T_montant_bien = new Array(0,6500,17000,60000,montant_bien);
	
	A_frais_notaire["frais_honoraires"] = 0;
	
	montant_bien = parseInt(montant_bien);
	

	for(i = 1; i < 5 ; i++){
		j = i-1;
		

			if(montant_bien > A_T_montant_bien[i]){
				A_frais_notaire["frais_honoraires"] += (((A_T_montant_bien[i] - A_T_montant_bien[j])*A_T_taux[i])/100);

			}
			
			/*if(montant_bien > A_T_montant_bien[j] && montant_bien <= A_T_montant_bien[t]){
				A_frais_notaire["frais_honoraires"] += ((montant_bien - A_T_montant_bien[t])*A_T_taux[t])/100;	
				
				console.log(" frais boucle " +  montant_bien + " "+A_T_montant_bien[t]+" "+((montant_bien - A_T_montant_bien[t])*A_T_taux[t])/100);
				console.log(" peiode" + (((A_T_montant_bien[t] - A_T_montant_bien[j])*A_T_taux[t])/100) );
			}	
			*/
			if(montant_bien <= A_T_montant_bien[i]){
				
				A_frais_notaire["frais_honoraires"] += (((montant_bien - A_T_montant_bien[j])*A_T_taux[i])/100);
				

				//console.log(" frais notaire inf" + montant_bien + " "+ A_T_montant_bien[j] +" "+ A_T_taux[i]+" "+ (((montant_bien - A_T_montant_bien[j])*A_T_taux[i])/100));
				i = 5;
			}
			
			if(montant_bien == A_T_montant_bien[i]){
				
				A_frais_notaire["frais_honoraires"] += (((montant_bien - A_T_montant_bien[j])*A_T_taux[i])/100);
				
				//console.log(" frais notaire ega	l" + (((montant_bien - A_T_montant_bien[j])*A_T_taux[i])/100));
				
				i = 5;
			}

	}

	// Nouvelle TVA 0.200 au lieu de 0.196;
	A_frais_notaire["frais_honoraires"] += A_frais_notaire["frais_honoraires"]*0.200;
	
	Total_frais = A_frais_notaire["droits_taxes"]+A_frais_notaire["frais_de_debours"]+A_frais_notaire["frais_honoraires"];
	
	A_p_frais_notaire["frais_de_debours"] = (A_frais_notaire["frais_de_debours"]/Total_frais)*100;
	A_p_frais_notaire["droits_taxes"] = (A_frais_notaire["droits_taxes"]/Total_frais)*100;
	A_p_frais_notaire["frais_honoraires"] = (A_frais_notaire["frais_honoraires"]/Total_frais)*100;
	
	Total_frais = Math.floor(Total_frais);
	info_notaire = '{"Frais_de_debours" : [{ "Montant" : '+Math.round(A_frais_notaire["frais_de_debours"])+', "Taux" : '+A_p_frais_notaire["frais_de_debours"].toFixed(1)+' }] , "Droits_taxes" : [ { "Montant" :'+Math.round(A_frais_notaire["droits_taxes"])+', "Taux" : '+A_p_frais_notaire["droits_taxes"].toFixed(1)+' } ], "Frais_honoraires" : [ { "Montant" :'+Math.round(A_frais_notaire["frais_honoraires"])+', "Taux" : '+A_p_frais_notaire["frais_honoraires"].toFixed(1)+' } ], "Total_frais" : '+Total_frais+'}';
	
	return info_notaire;
}

function contains(arr, value) {
    var i = 0, len = arr.length;
    while( i < len && arr[i] != value ) {
        i++; 
    }
    return i != len;
}
function lwevent(category, action, label, value){
    if (category && action) {
        if (typeof label == "undefined") {
            var label = "";
        }
        if (typeof value == "undefined") {
            var value = 0;
        }
        //_gaq.push( [ '_trackEvent', category , action , label , value ] );
		ga('send', 'event', category , action , label , value);
    }	
}


