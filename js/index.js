 window.onload = function(){
	  //定义数组  用于存储数组对象
	  // var P1 = [{3,2,2},{2,0,0},{1,2,2}];
	  // var P2 = [{9,0,2},{3,0,2},{6,0,0}];
	  // var P3 = [{2,2,2},{2,1,1},{0,1,1}];
	  // var P3 = [{4,3,3},{0,0,2},{4,3,1}];
	  
	  //定义对象
	  function Available(A,B,C){
		this.A = A;
		this.B = B;
		this.C = C;
	  }
	  
	  function Max(A,B,C){
		this.A = A;
		this.B = B;
		this.C = C;
	  }
	  
	  function Need(A,B,C){
		this.A = A;
		this.B = B;
		this.C = C;
	  }
	  
	  function Allocation(A,B,C){
		this.A = A;
		this.B = B;
		this.C = C;
	  }
	  //初始化
	  //t0时刻A，B,C可用资源为 3 3 2
	  var available = new Available(3,3,2);
	  //p0 进程
	  var Ma0 = new Max(7,5,3);
	  var Al0 = new Allocation(0,1,0);
	  var Ne0 = new Need(7,4,3);
	  //p1 进程
	  var Ma1 = new Max(3,2,2);
	  var Al1 = new Allocation(2,0,0);
	  var Ne1 = new Need(1,2,2);
	  //p2进程
	  var Ma2 = new Max(9,0,2);
	  var Al2 = new Allocation(3,0,2);
	  var Ne2 = new Need(6,0,0);
	  //p3进程
	  var Ma3 = new Max(2,2,2);
	  var Ne3 = new Need(0,1,1);
	  var Al3 = new Allocation(2,1,1);
	  //p4进程
	  var Ma4 = new Max(4,3,3);
	  var Al4 = new Allocation(0,0,2);
	  var Ne4 = new Need(4,3,1);
	  //p0,p1,p2,p3,p4的资源分配
	  var P0 = [Ma0,Ne0,Al0];
	  var P1 = [Ma1,Ne1,Al1];
	  var P2 = [Ma2,Ne2,Al2];
	  var P3 = [Ma3,Ne3,Al3];
	  var P4 = [Ma4,Ne4,Al4];
	  var P = [P0,P1,P2,P3,P4];
	  //进程请求资源
	  $(".request").click(function(){
		   var i = parseInt($("#pnum").val());
		   var index = i;
		   //进程i需要A,B,C的资源数
		   var reA = parseInt($("#A").val());
		   var reB = parseInt($("#B").val());
		   var reC = parseInt($("#C").val());
		   if(i == undefined || i < 0 || i > P.length ||
			reA == undefined || reB == undefined || reC == undefined || 
			reA < 0 || reB < 0 || reC < 0){
		   		alert("输入非法");
		   		return;
		   }
		   if(reA > P[i][1].A || reB > P[i][1].B || reC > P[i][1].C ){
			  alert("请求失败! 进程" + i + "所需要的资源数大于它所宣布的Need!");
		   }else if(reA > available.A || reB > available.B || reC > available.C){
			  alert("请求失败! 进程" + i + "所需要的资源数大于资源的availableailable!");
		   }else{
			    //1.试探着把资源分配给进程i   
			    //available[j] =  available[j] - Request[j];
			    available.A = available.A - reA;
			    available.B = available.B - reB;
			    available.C = available.C - reC;
			    //Allocation[i, j] = Allocation[i, j] + Request[j];
			   	P[i][2].A = P[i][2].A + reA;
			   	P[i][2].B = P[i][2].B + reB;
			   	P[i][2].C = P[i][2].C + reC;	   
			   //Need[i, j] = Need[i, j] - Request[j];
			    P[i][1].A = P[i][1].A - reA;
			   	P[i][1].B = P[i][1].B - reB;
			   	P[i][1].C = P[i][1].C - reC;
				
				//2.执行安全性算法
				//设置一个工作变量work, 初始化work = available
				var work = new Available(available.A, available.B, available.C);
				//设置一个数组finish, 表示系统是否有足够的资源分配给某个进程
				var finish = new Array(P.length);
				for(var j = 0; j < P.length; j++){
				   for(var i = 0; i < P.length; i++){
						//从进程集合p中找到一个能满足finish = false 且 Need <= availableailable 的进程
						//如果找到,就把该进程的Allocation(已分配资源)释放出来,并把finish标志为true
						//即available[j] = available[j] + Allocatio[i][j], finish[i] = true
						if(!finish[i] && P[i][1].A <= work.A && P[i][1].B <= work.B && P[i][1].C <= work.C){
							work.A = work.A + P[i][2].A;
							work.B = work.B + P[i][2].B;
							work.C = work.C + P[i][2].C;
							finish[i] = true;
							break;
						}
				   }
				}
				//若所有进程的finish都等于true,就表示系统是安全的,否则系统处于不安全状态,拒绝分配资源给进程i
				for(var i = 0; i < finish.length; i++){
					if(!finish[i]){
						//恢复到未分配前状态3\
						//Available
						available.A = available.A + reA;
						available.B = available.B + reB;
						available.C = available.C + reC;
						//Allocation
						P[i][2].A = P[i][2].A - reA;
						P[i][2].B = P[i][2].B - reB;
						P[i][2].C = P[i][2].C - reC;
						//Need
						P[i][1].A = P[i][1].A + reA;
						P[i][1].B = P[i][1].B + reB;
						P[i][1].C = P[i][1].C + reC;
						alert("请求失败! 分配资源给进程" + i + "后, 系统处于不安全状态!");
						return;
					}
				}
				alert("请求成功! 进程" + index + "分配到A: " + reA + ", B: " + reB + ", C: " + reC);
				//更新界面
				var tr = document.getElementById(index);
				var children = tr.children;
				children[1].innerHTML = P[index][0].A + " " + P[index][0].B + " " + P[index][0].C;
				children[2].innerHTML = P[index][2].A + " " + P[index][2].B + " " + P[index][2].C;
				children[3].innerHTML = P[index][1].A + " " + P[index][1].B + " " + P[index][1].C;
				var tr = document.getElementById(-1);
				tr.children[4].innerHTML = available.A + " " + available.B + " " + available.C;
		   }
	   });
	   
	//撤销进程资源
	$(".recover").click(function(){
		var i = parseInt($("#pnum2").val());
		if(i == undefined || i < 0 || i > P.length){
				alert("输入非法");
				return;
		}
		//把进程i已经分配的资源释放
		available.A += P[i][2].A;
		available.B += P[i][2].B;
		available.C += P[i][2].C;
		//删除进程i
		P.slice(i, 1);
		var child = document.getElementById(i);
		child.parentNode.removeChild(child);
		var tr = document.getElementById(-1);
		tr.children[4].innerHTML = available.A + " " + available.B + " " + available.C;
		alert("回收进程" + i + "成功!");
	});

 }