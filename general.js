var obj_critere_form = {};
var duree_init = 20;



$(document).ready(function(){
	
	$("#simulateur-achylles").on("click","label",function(){
		// name_input = $(this).children("input").attr("name");
		// if(name_input){
			// onglet = obj_critere_form.simulation_encours;
			// $("#simul_"+onglet+" input[name='"+name_input+"']").focus();	
		// }
		// return false 
		});
	
	obj_critere_form = new critere_form();
	obj_critere_form.initialize();
	
	

	//evenement
	$("#simulateur-achylles").on("click","button[id='btp_valider']",function(){ mortgage_function();});
	$("#simulateur-achylles").on("focus","input[type='text']",function(){ type_champ("input",this,"focus");});
	$("#simulateur-achylles").on("blur","input[type='text']",function(){ type_champ("input",this,"blur");});
	$("#simulateur-achylles").on("focus","input[type='tel']",function(){ type_champ("input",this,"focus");});
	$("#simulateur-achylles").on("blur","input[type='tel']",function(){ type_champ("input",this,"blur");});
	$("#simulateur-achylles").on("keydown","input[type='tel']",function(evt){ valid_char(evt);});
	$("#simulateur-achylles").on("keydown","input[type='text']",function(evt){ valid_char(evt);});
	$("#simulateur-achylles").on("mouseup","[id^='slider_']",function(){ mortgage_function();});
	
	$("#simulateur-achylles").on("click","label[class*='liste_choix']",function(){ type_champ("label",$(this),"click"); });
	
	$("#simulateur-achylles").on("change","select",function(){ type_champ("select",this,"change");});
	
	simulation_hover = obj_critere_form.simulation_encours;
	initialisation_champ();
	taille_div_global_cal("#simulateur-achylles");
	init_slider(simulation_hover);
	
	//focus_on("rev_emp");

});

function mortgage_function(){
	Calcul_capacite();
}

function critere_form(){
	
	var form_critere = document.criteres;
	
	this.code = form_critere.code.value;
	this.act = form_critere.act.value;
	this.coulfondarriere = form_critere.coulfondarriere.value;
	this.coulfond = form_critere.coulfond.value;
	this.type_champ_txt = form_critere.type_champ_txt.value;
	
	this.simulation_encours = form_critere.simulation_encours.value;
	
	this.simulation_total = form_critere.simulation_total.value;
	this.copie_html = $("#simul_1").html();
	this.simulation_total_cree = 1;
	
	this.initialize = function() {
		
		this.simulation_encours = form_critere.simulation_encours.value = 1;
		this.simulation_total = form_critere.simulation_total.value = 1;
		this.simulation_total_cree = 1;

		this.taille_L = cal_taille();
	}
	
	this.enregistrement_champ = function(champ,valeur) {
		this[champ] = valeur;	
		//document.forms["criteres"].elements[champ].value = valeur;
		
		document.forms["criteres"].elements[champ].value = valeur;
		//form_critere.elements[champ].value = valeur;
    }
}

function type_champ(type_champ,element,evenement){
	
	aff_resultat = 1;
	simulation_hover = obj_critere_form.simulation_encours;
	
	var f = document.forms["formulaire_"+simulation_hover];
	
	if(type_champ == "input"){
		if(evenement == "focus"){
			
			aff_montant(element.name,"");
			focus_css(type_champ,element,1);
			sup_err(element);
			aff_resultat=0;
		}
		else if(evenement == "blur"){
			
			validation = blur_recup_val(element.name,'');
			focus_css(type_champ,element,validation);
			
			if(validation == 0){
				txt_erreur = "Oops, il semblerait qu'il y ait une erreur, veuillez vérifier s'il vous plait";
				aff_erreur(element,txt_erreur);
			}
			
			else{
				if(element.id == "rev_emp" || element.id == "rev_coemp" || element.id == "rev_autres" || element.id == "chg_credits" || element.id == "chg_pensions" || element.id == "chg_autres"){
					evaluation_mensualite("",33);
					focus_css("input","mensualite_pret",1);
				}
				
				if(element.id == "duree_emprunt"){
					onblur_duree_emprunt(element.value);
				}
				else if(element.id == "taux"){
					onblur_taux(element.value,"taux_interet");
				}
				else if(element.id == "montant_apport"){
					onblur_montant_apport(element.value);
					aff_montant_sep(element.name,"");
				}
				
				/*if(aff_resultat == 1){
					mortgage_function();
				}*/
			}
		}
	}
	else if(type_champ == "select"){
		if(evenement == "change"){
			if(element.id == "mois_salaire_emp" || element.id == "mois_salaire_co_emp"){
				evaluation_mensualite("",33);
			}
		}
	}
	
	else if(type_champ == "label"){
		if(evenement == "click"){
			
			id = element.data("name");
			
			if(id == "idnature"){
				select_champ_label(element);
						
				if(f.idnature.value == 0 || f.idnature.value == "" ){
					aff_resultat = 0;
				}
			}
			
			
		}
	}
	
	if(aff_resultat == 1){
		mortgage_function();
	}
	
	
}

function init_slider(simulation_hover){

	$("#slider_duree_credit_"+simulation_hover).slider({
		orientation: "horizontal",
		range: "min",
		max: 30,
		min: 2,
		step: 1,
		slide: function(event,ui) {
			aff_fond_potent_duree_emprunt(ui.value);
		}
    });

	$("#slider_taux_interet_"+simulation_hover).slider({
		orientation: "horizontal",
		range: "min",
		max: 5,
		min: 0,
		step: 0.10,
		slide: function(event, ui) {
			aff_fond_potent_taux_interet(ui.value);
		}
	});
	
	$("#slider_apport_perso_"+simulation_hover).slider({
		orientation: "horizontal",
		range: "min",
		max: 268,
		min: 1,
		step: 1,
		slide: function(event, ui) {
			focus_css("input","montant_apport",1);aff_fond_potent_duree_taux_apport(ui.value,"slider","apport_perso");
		}
	});
	
	
	onblur_duree_emprunt(duree_init);
	
	//onblur_montant_apport("0");
	
	//focus_on("rev_emp");

}

function aff_fond_potent_duree_emprunt(val_champ){

	simulation_hover = obj_critere_form.simulation_encours;

	var f = document.forms["formulaire_"+simulation_hover];
	
	var max = $('#slider_duree_credit_'+simulation_hover).slider('option','max');
	var min = $('#slider_duree_credit_'+simulation_hover).slider('option','min');
	
	if(val_champ > min && val_champ <= max){
		$("#simulateur-achylles #fond_duree_credit .ui-slider-horizontal .ui-slider-handle").css("margin-left","-10px");
	}
	else{
		$("#simulateur-achylles #fond_duree_credit .ui-slider-horizontal .ui-slider-handle").css("margin-left","0");
	}

	
	//reglage_taille_img = ((val_champ - min)*267/(max - min))+6;
	//$('#tav_potent_1').css('width',reglage_taille_img+"px");
	f.duree_emprunt.value = val_champ;
	
	for (i=0;i<tauxDD.length;i++){
		if(val_champ >= tauxDD[i]){
			tempo_ta = tauxVA[i];
		}
	}	
	onblur_taux(tempo_ta,"taux_interet");
}

function aff_fond_potent_taux_interet(taux_champ){
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];

	var max = $('#slider_taux_interet_'+simulation_hover).slider('option','max');
	var min = $('#slider_taux_interet_'+simulation_hover).slider('option','min');
	
	if(taux_champ > min && taux_champ <= max){
		$("#simulateur-achylles #fond_taux_interet .ui-slider-horizontal .ui-slider-handle").css("margin-left","-10px");
	}
	else{
		$("#simulateur-achylles #fond_taux_interet .ui-slider-horizontal .ui-slider-handle").css("margin-left","0");
	}
	
	
	//reglage_taille_img = ((taux_champ - min)*267/(max - min))+6;
	//$('#av_potent_2').css('width',reglage_taille_img+"px");
	
	var reg_ent = new RegExp("^[0-5]{1}.[0-9]{2}$","g");
	
	if(reg_ent.test(taux_champ) == false){
		
		taux_champ = taux_champ+"";
		
		if(taux_champ.indexOf(".",0) == -1){
			taux_champ += ".";
		}
		
		var reg_ent = new RegExp("^[0-5]{1}.[0-9]{1}$","g");
			
		if(reg_ent.test(taux_champ) == true){
			taux_champ = taux_champ+"0";
		}
		else{
			taux_champ = taux_champ+"00";
		}
	}
	f.taux.value = taux_champ;
}

function onblur_duree_emprunt(val_champ){
	
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	
	if(val_champ != ""){	
		if(val_champ < 7) val_champ = 7 ;
		if(val_champ > 30) val_champ = 30 ;
	
		$('#slider_duree_credit_'+simulation_hover).slider({ value : val_champ});
		aff_fond_potent_duree_emprunt(val_champ);	
	}
}

function onblur_taux(val_champ,type_champ){
	
	simulation_hover = obj_critere_form.simulation_encours;

	if(val_champ != ""){

		if(type_champ == "taux_interet"){
			if(val_champ > 5) val_champ = 5 ;
			if(val_champ < 0) val_champ = 0 ;
			$('#slider_taux_interet_'+simulation_hover).slider({ value : val_champ});
			aff_fond_potent_taux_interet(val_champ);
		}
	}		
}

function onblur_montant_apport(val_champ){
	
	simulation_hover = obj_critere_form.simulation_encours;
	
	if(val_champ != ""){

		val_champ = sup_espace_montant(val_champ);

		var max_slider = $('#slider_apport_perso_'+simulation_hover).slider('option','max');
		
		if(val_champ < 1000000){
			val_px = aff_fond_potent_duree_taux_apport(val_champ,"champ_formulaire","apport_perso");
			if(val_px > max_slider) val_champ = max_slider;
			$('#slider_apport_perso_'+simulation_hover).slider({value : val_px});
		}
		else{
			val_champ = 999999;
			$('#slider_apport_perso_'+simulation_hover).slider({value : max_slider});
			aff_fond_potent_duree_taux_apport(val_champ,"champ_formulaire","apport_perso");
		}
	}		
}

function select_champ_label(element){
	
	simulation_hover = obj_critere_form.simulation_encours;
	
	var f = document.forms["formulaire_"+simulation_hover];
	
	value_champ = element.data("value");
	name_champ = element.data("name");
			
	f.elements[name_champ].value = value_champ;
			
	$("#simul_"+simulation_hover+" label[data-name='"+name_champ+"']").removeClass("liste_choix_on").addClass("liste_choix");
	$("#simul_"+simulation_hover+" label[data-name='"+name_champ+"'][data-value='"+value_champ+"']").addClass("liste_choix_on");
}

function initialisation_champ(){
	
	$("input[type='text']").each(function(){
		if($(this).val() == "" && $(this).attr("data-type") != "ville_cp"){
			$(this).val(0);
		}
	});
	
	$("input[type='tel']").each(function(){
		if($(this).val() == "" && $(this).attr("data-type") != "ville_cp"){
			$(this).val(0);
		}
	});
}

function ajout_simulation_html(){
	
	nb_simulation_total_cree = obj_critere_form.simulation_total_cree;
	nb_simulation_total = obj_critere_form.simulation_total;

	nb_simulation_total++;

	var largeur_cal = obj_critere_form.taille_L;

	largeur_cal = largeur_cal + 20;

	if(largeur_cal >= 768 && largeur_cal < 1240){
		nb_simulation_max = 2;
	}
	else{
		nb_simulation_max = 3;
	}
	
	if(nb_simulation_total <= nb_simulation_max){
		
		nb_simulation_total_cree++;
		
		obj_critere_form.simulation_total_cree = nb_simulation_total_cree;	
		obj_critere_form.enregistrement_champ("simulation_total",nb_simulation_total);
	
		content_html = transforme_content_html(obj_critere_form.copie_html);

		ajout_simulation = nb_simulation_total_cree;
		
		id_dernier_simul = $(".simulateur").last().data("formsimulation");
		
		$("#simul_"+id_dernier_simul).after('<div class="simulateur" data-formsimulation='+ajout_simulation+' id="simul_'+ajout_simulation+'" style="display:none">'+content_html+'</div>');
		$("#onglet_simul_"+id_dernier_simul).after('<div class="onglet_simulation visu_on" data-simulation='+ajout_simulation+' id="onglet_simul_'+ajout_simulation+'"><div class="supp" data-supp="'+ajout_simulation+'">X</div><span>Simulation n&deg;'+ajout_simulation+'<i class="result_capacite_achat"></i></span></div>');

		aff_onglet("",ajout_simulation);
		init_slider(ajout_simulation);
		
		if(nb_simulation_total == nb_simulation_max){
			$(".ajout").hide();
		}
		var f0 = document.forms["criteres"]; 
		lwevent("simulateur-ach","onglet_ajout_simulation",f0.act.value);
	}
}

function aff_fond_potent_duree_taux_apport(val_champ,choix_passage,choix_slider){

	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	

	var max = $('#slider_'+choix_slider+'_'+simulation_hover).slider('option','max');
	var min = $('#slider_'+choix_slider+'_'+simulation_hover).slider('option','min');
	
	reglage_taille_img = ((val_champ - min)*267/(max - min))+6;

	if(choix_slider == "apport_perso"){

		val_champ_max = val_champ;
		
		var max_slider = $('#slider_'+choix_slider+'_'+simulation_hover).slider('option','max');
		var min_slider = $('#slider_'+choix_slider+'_'+simulation_hover).slider('option','min');
		
		if(val_champ > max_slider) val_champ_max = max_slider;
		
		
		if(choix_passage == "champ_formulaire"){
			A_tranche_euro = new Array(1,53,106,159,212,268);
			A_tranche_px = new Array(0,100000,200000,300000,400000,500000);
		}
		else{
			A_tranche_euro = new Array(0,100000,200000,300000,400000,500000);
			A_tranche_px = new Array(1,53,106,159,212,268);
		}
		
		taille_A_tranche_px = A_tranche_px.length;
		
		for(i=0;i<taille_A_tranche_px;i++){
			if(val_champ<A_tranche_px[i]){
				tranche = i;
				pos = 1;
				break;
			}

			if(val_champ == A_tranche_px[i]){
				tranche = i;
				pos = 0;
				break;
			}
		}

		if(pos == 0){
			result = A_tranche_euro[tranche];
		}
		else if(pos == -1){
			test = taille_A_tranche_px-1;
			result = A_tranche_euro[test];
		}
		else{
			tranche_avant = tranche - pos;
			X_val_champ = val_champ - A_tranche_px[tranche_avant];
			val_tranche_zero = A_tranche_euro[tranche] - A_tranche_euro[tranche_avant];
			val_tranche_px = A_tranche_px[tranche]-A_tranche_px[tranche_avant];
			result = Math.round(((X_val_champ * val_tranche_zero) / (val_tranche_px))+A_tranche_euro[tranche_avant])
		}
	
		if(choix_passage == "champ_formulaire"){
			val_champ_max = result;
		}

		reglage_taille_img = (val_champ_max*278/max_slider);

		//$('#av_potent_3').css('width',reglage_taille_img+"px");
		
		if(choix_passage == "slider"){
			
			// pour supprimer les centaines et dizaines
			val_champ = result+"";
			nb_caratere_total = val_champ.length;

			switch (nb_caratere_total){
				case 3: 
				case 4: nb_sup = 2; break;
				case 5: 
				case 6: nb_sup = 3; break;
			}
			
			if(result > 100000) nb_sup = 4; 
			
			nb_caractere = nb_caratere_total - nb_sup;
			debut = val_champ.substr(0,nb_caractere);
			val_zero = "";
			
			for(i = nb_caractere; i <nb_caratere_total ; i++) val_zero+="0";

			val_versement_format = debut+""+val_zero;
			val_champ = parseInt(val_versement_format);	
			val_champ = number_format_aff(val_champ);
		}

		f.montant_apport.value = val_champ;
		
		if(choix_passage == "champ_formulaire") return result;
	}
}

function evaluation_mensualite(mens_souhait,taux){
	
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	
	
		var_revenus = calcul_revenus();
		var_charges = calcul_autres_charges();
		
		if(taux != ""){
			var_evaluation_mensualite = (var_revenus*(taux/100))-var_charges;
			f.mensualite_pret.value = number_format_aff(Math.round(var_evaluation_mensualite));
			f.mensualite_tempo.value = Math.round(var_evaluation_mensualite);
		}
		else{
			mens_souhait = parseInt(mens_souhait);
			taux = ((mens_souhait+var_charges)/var_revenus)*100;
		}	
}

function calcul_revenus(){
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	
	som_rev = 0;
	
	rev_emp = parseInt((sup_espace_montant(f.rev_emp.value)*f.mois_salaire_emp.value)/12);
	if(rev_emp > 0) som_rev += rev_emp;
	
	rev_coemp = parseInt((sup_espace_montant(f.rev_coemp.value)*f.mois_salaire_co_emp.value)/12);
	if(rev_coemp > 0) som_rev += rev_coemp;
	
	rev_autres = parseInt(sup_espace_montant(f.rev_autres.value));
	if(rev_autres > 0) som_rev += rev_autres;

	return som_rev;
}

function calcul_autres_charges(){
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	
	som_autres = 0;
	
	chg_credits = parseInt(sup_espace_montant(f.chg_credits.value));
	if(chg_credits > 0) som_autres += chg_credits;
	
	chg_pensions = parseInt(sup_espace_montant(f.chg_pensions.value));		
	if(chg_pensions > 0) som_autres += chg_pensions;
	
	chg_autres = parseInt(sup_espace_montant(f.chg_autres.value));
	if(chg_autres > 0) som_autres += chg_autres;
	
	return som_autres;
}


function Calcul_capacite(){
	
	simulation_hover = obj_critere_form.simulation_encours;
	var f = document.forms["formulaire_"+simulation_hover];
	div_parent_simul = "simul_"+simulation_hover;
	
	var apport,duree,rapport,ta,tm,mens,index,capa;
	
	mens = parseInt(sup_espace_montant(f.mensualite_pret.value));
	apport = parseInt(sup_espace_montant(f.montant_apport.value));
	duree = parseInt(sup_espace_montant(f.duree_emprunt.value));	
	taux = sup_espace_montant(f.taux.value);

	mens_tempo = f.mensualite_tempo.value;
	
	if(mens_tempo > 0){
	
		if(taux < 0.1){
			taux = 0.1;
		}
		
		ta = taux / 100;
		
		//-- Verifications
		if ( mens == 0 || mens >= 9999){ f.mensualite_pret.value = f.mensualite_tempo.value; mens = f.mensualite_tempo.value;}
		
		if (taux > 6){ f.taux.value = 6; taux = 6;}
		
		if(mens > mens_tempo){ 
			$("#info_mens").hide();
			$("#etape2 #err").html("<img hspace='6' src='/imgcustom/ci-formulaire/attention.gif'> Attention, cette mensualit&eacute; vous fait d&eacute;passer le taux d'endettement de 33 %, id&eacute;al pour l'obtention d'un cr&eacute;dit immobilier.");
		}
		
		tm = ta / 12;
		capa = mens * (1 - Math.pow(1/(1+tm),12*duree)) / tm + apport;
		capa = Math.round(capa);
		
		Json_frais_notaire = calcul_frais_notaire(capa,f.idnature.value,"");

		objJson = JSON.parse(Json_frais_notaire);

		var montant_capacite = capa-apport;
		
		
		capacite_total = capa-objJson.Total_frais;
		capacite_total = Math.round(capacite_total);
		
		$("#"+div_parent_simul+" .resultat").show();
		
		$("#onglet_"+div_parent_simul+" span").addClass("dec_resultat");
		$("#onglet_"+div_parent_simul+" .result_capacite_achat").html("<br>Capacite d achat : "+number_format_aff(capacite_total)+" &euro;");
		
		
		$("#"+div_parent_simul+" .result_cap2").html(number_format_aff(capacite_total));
		$("#"+div_parent_simul+" .montant_capacite").text(number_format_aff(montant_capacite));
		$("#"+div_parent_simul+" .mont_apport_perso").text(number_format_aff(apport));
		$("#"+div_parent_simul+" .mont_frais_notaire").text(number_format_aff(objJson.Total_frais));
		
		lwevent('simulateur-ach','simulation','immo_cap2');
		
		setTimeout(function(){ taille_div_global_cal("#simulateur-achylles"); },100);
		
	}	
}





$("#emp-trigger").on('focusout', mortgage_function); btn-single


