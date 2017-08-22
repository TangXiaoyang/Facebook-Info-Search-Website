<?php
	require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
	header('Access-Control-Allow-Origin: *');
?>


<?php
	$q = $type = "";
	$api = "https://graph.facebook.com/v2.8/search?";
	$token ="EAAB1gmiXGrgBAFu4XEHCHkFAqWntKnIjyNgLCH0hBpclZBA5u0cYDpbB0WEVuDTD1NGj4jQbRzNQrqYMslRLOGfRYs4bo3uFeMOdnmtykbfehZC4JG8xQ23ztpdzSCdZCkHZCEXWbAqXnn1MDLB96eVdyMrs9LEZD";


	$fb = new Facebook\Facebook([
		'app_id' => '129202960931512',
		'app_secret' => 'f437c7c7dc98792cc17c8f35891ccb96',
		'default_graph_version' => 'v2.8',
	]);

	$fb->setDefaultAccessToken($token);


	if(array_key_exists('q', $_GET)){
		$q = $_GET['q'];
		$type = ["user", "page", "event", "place", "group"];


		$batch = [];
		array_push($batch, $fb->request("GET", '/search', ['q' => $q, 'type' => $type[0], 'fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token]));
		array_push($batch, $fb->request("GET", '/search', ['q' => $q, 'type' => $type[1], 'fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token]));
		array_push($batch, $fb->request("GET", '/search', ['q' => $q, 'type' => $type[2], 'fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token]));
		if($_GET['lat'] == 10000 && $_GET['log'] == 10000){
			array_push($batch, $fb->request("GET", '/search', ['q' => $q, 'type' => $type[3], 'fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token]));
		}else{
			$center = $_GET['lat'] . "," . $_GET['log'];
			array_push($batch, $fb->request("GET", '/search', ['q' => $q, 'type' => $type[3], 'fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token, 'center' => $center]));
		}
		array_push($batch, $fb->request("GET", '/search', ['q' => $q, 'type' => $type[4], 'fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token]));
		

		try {
	  		$responses = $fb->sendBatchRequest($batch);
		} catch(Facebook\Exceptions\FacebookResponseException $e) {
	  		// When Graph returns an error
	  		echo 'Graph returned an error: ' . $e->getMessage();
	  		exit;
		} catch(Facebook\Exceptions\FacebookSDKException $e) {
	  		// When validation fails or other local issues
	  		echo 'Facebook SDK returned an error: ' . $e->getMessage();
			exit;
		}

		$i = 0;
		foreach ($responses as $response) {
			echo $response->getBody();
			if($i != 4)	echo "---";
			$i = $i + 1;
		}
	}else if(array_key_exists('id', $_GET)){
		if(strcmp($_GET['type']."", "event_tab") == 0){
			$request = $fb->request("GET", '/' . $_GET['id'],  ['fields' => 'id,name,picture.width(700).height(700)', 'access_token' => $token]);
			$response = $fb->getClient()->sendRequest($request);
			echo $response->getBody();
			exit;
		}
			$request = $fb->request("GET", '/' . $_GET['id'],  ['fields' => 'id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture}},posts.limit(5){created_time,message}', 'access_token' => $token]);
			// echo $request->getUrl();
			try{
				$response = $fb->getClient()->sendRequest($request);
			}catch(Facebook\Exceptions\FacebookResponseException $e){
				echo "";
				exit;
			}catch(Facebook\Exceptions\FacebookSDKException $e){
				echo "";
				exit;
			}
			echo $response->getBody();
		

		
	}else if(array_key_exists('pic_ids', $_GET)){
		$batch = [];

		foreach ($_GET['pic_ids'] as $id) {
			$request = $fb->request("GET", "/".$id."/picture?");
			array_push($batch, $request);
			// echo "$id:";
			// echo $request->getUrl();
			// echo "------------------------------------------------------------------------------";

		}
		try {
	  		$responses = $fb->sendBatchRequest($batch);
		} catch(Facebook\Exceptions\FacebookResponseException $e) {
	  		// When Graph returns an error
	  		echo 'Graph returned an error: ' . $e->getMessage();
	  		exit;
		} catch(Facebook\Exceptions\FacebookSDKException $e) {
	  		// When validation fails or other local issues
	  		echo 'Facebook SDK returned an error: ' . $e->getMessage();
			exit;
		}
		// $i = 0;
		foreach ($responses as $key => $value) {
			$urlObj = $value->getHeaders();
			echo $urlObj[5]['value'];
			echo "---";
		}
		// foreach ($responses as $response) {
		// 	echo $response->getBody();
		// 	if($i != count($responses) - 1) echo "---";
		// 	$i++;
		// }
	}
	
	// echo "I have received your request";
?>