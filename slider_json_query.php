<?php

	if  (!empty($_POST["slider"])){
		$_SESSION["slider"] = $_POST["slider"];
		$row = $_POST["slider"];

		$json = file_get_contents('Theme/Air/assets/Slido/slido.json');
		$json = json_decode($json);
		
		if($row == 1){

			$json[] = $row;
			$count = count($json);
			$json = json_encode($json);

			file_put_contents('Theme/Air/assets/Slido/slido.json',$json);		
		}
		elseif($row == -1){

			array_pop($json);
			$count = count($json);
			$json = json_encode($json);

			file_put_contents('Theme/Air/assets/Slido/slido.json',$json);
		}
		header("Location: ".$_SERVER["REQUEST_URI"]);
    	exit;

	}
	elseif(empty($_POST["slider"])){
		$json = file_get_contents('Theme/Air/assets/Slido/slido.json');
		$json = json_decode($json);
		$count = count($json);
		$json = json_encode($json);
		//echo $json . ' successs load ' . $count;
	}