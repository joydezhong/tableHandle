/**
 * 注释说明:
 * // 此为函数说明 包括传参 作用
 * 
 * //$ 为插件扩展调用
 */
(function ($) {
    $.fn.extend({  
    	
    	// 获取table行列数 ；返回一个obj 包含行数列数
    	getRowColNum: function(){ 
			var obj;
			this.each(function(){
				var row_num = $(this).find("tr").length;  //行
				var col_num = $(this).find("td").length / (row_num - 1); //列
				obj = {rows: row_num, cols: col_num};
			});
			return obj;
		},
		
		/**
		 * 获取第一列除时间th外的所有td 用于顺序插入行
		 * @param {Number} num 顺序插入的基准列的索引
		 * 返回Array 整列的td数组
		 */
		getFirstColTd: function(num){
			var allcoltd = [];
			
			$("tr",this).each(function(index){
				var e_row = $(this).children().eq(num);
				allcoltd.push(e_row);
			});
			
			allcoltd = allcoltd.length > 0 ? allcoltd : "";  //全列数组

			return allcoltd;	
		},
		
		/**
		 * 添加行  顺序插入
		 * @param {String} table  表格元素的选择器
		 * @param {Array} arrcols 第一列除去th的数组
		 * @param {Number} trlen  tr里面子元素的个数
		 * @param {String} newstr 新增行的字符串（推荐number）
		 */
		addRow: function(table, arrcols, trlen, newstr){  
			return this.each(function(){
				var arr = [];
				$(arrcols).each(function(){
					arr.push($(this).text());
				});
				arr.push(newstr);
				arr.sort(function(x, y){
					x = parseInt(x);
					y = parseInt(y);
					if(x<y){
						return -1;
					}
					if(x>y){
						return 1;
					}
					return 0;
				});
				var index = arr.indexOf(newstr);
				var _html;
				for(var i = 1;i < trlen; i++){  // tr的长度就是需要td的个数
					_html += "<td></td>";
				}
				table.find("tr").eq(index).after("<tr><td>" + newstr + "</td>" + _html + "</tr>");
			});
		},
		
		// 传参数： 表格selector、新列
		/**
		 * 
		 * @param {Object} table  表格元素的选择器
		 * @param {Object} rownum 表格中的行数
		 * @param {Object} newstr 新增列的字符串
		 */
		addCol: function(table, rownum, newstr){  
			return this.each(function(){
				
				$("tr:first",this).append("<th>" + newstr + "</th>");
				
				$("tr:gt(0)",this).each(function(){
					
					$(this).append("<td></td>");
				});
			});
		},
		
		//双击单元格编辑
		clickedit: function(){
			return this.each(function(){
				 $('tr:gt(0)', this).each(function (row) {
				 	$('td', this).each(function (col) {  //*包括开头一个时间格
				 		$(this).on("dblclick",function(){
				 			
							if(!$(this).is('.input')){
						      	$(this).addClass('input').html('<input type="text" value="'+ $(this).text() +'" />').find('input').addClass("editinput").focus().blur(function(){
						        	$(this).parent().removeClass('input').html($(this).val() || "");
						      	});
						    }
				 		});
				 	}).hover(function(){
				 		
				 		$(this).addClass("td-hover").siblings().removeClass("td-hover");
				 	},function(){
				 		$(this).removeClass("td-hover");
				 	});
				 });
			});
		},
		
		//点击第一列的td选择行
		clickSelectRows: function(){
			return this.each(function(){
				var $table = $(this);
				
				$("tr", this).each(function(){  
					$("td:first",this).on("click",function(){
						
						$(this).parent().addClass("click").siblings().removeClass("click");
						
						var index = $("th.click", $table).index(); //样式不冲突 选择行时取消列
						$("tr", $table).each(function(n,e){
							$(e).find("th").eq(index).removeClass("click");
							$(e).find("td").eq(index).removeClass("click");
						});
						
						return false;   // 阻止时间冒泡 从而执行点击区域外部撤销样式
					});
					
				});
			})
		},
		
		//点击th选择列
		clickSelectCols: function(){
			return this.each(function(){
				var $table = $(this);
				
				$("th:gt(0)", this).each(function(){
					
					$(this).on("click",function(){
						
						var n = $("tr:first", $table).find(this).index();  // 获取实际索引值
						$(this).addClass("click").siblings().removeClass("click");
	
						$table.find("tr:gt(0)").each(function(){
							$("td:eq("+ n +")", this).addClass("click").siblings().removeClass("click");
						});
	
						$("tr", $table).each(function(){  //样式不冲突 选择列时取消行
							$(this).removeClass("click");
						});
						
						return false;   // 阻止时间冒泡 从而执行点击区域外部撤销样式
					});
					
				});
			})
		},
		
		//删除列操作
		deleteCol: function(){
			return this.each(function(){
				$(this).find("tr").each(function(){
					$(this).find(".click").remove();
				});
			});
		},
		
		//删除行操作
		deleteRow: function(){
			return this.each(function(){
				$(this).find(".click").remove();
			});
		},
		
		//点击头部th 列排序
		clickTheadSortCol: (function(){
			var sort = [].sort;
			
			return function(compare_fn, getSorted_fn){
				getSorted_fn = getSorted_fn || function(){
					return this;
				};
				
				var placements = this.map(function(){
					var sortElement = getSorted_fn.call(this),
						parentNode = sortElement.parentNode,
						
						nextSibling = parentNode.insertBefore(
							document.createTextNode(''),
							sortElement.nextSibling,
						);
						
						return function(){
							if(parentNode === this){
								throw new Error("排序出错,请检查元素结构!");
							}
							
							parentNode.insertBefore(this, nextSibling)
						};
				});
				
				return sort.call(this, compare_fn).each(function(i){
					placements[i].call(getSorted_fn.call(this));
				})
			};
			
		})()
		
    });  
    
    
    
    //点击外部取消样式 自执行
    (function(){
    	$(document).click(function(e){
			var target = $(e.target);
			if (target.closest(".container").length == 0) {  // 从自身开始向上寻找 并没有找到对应元素
				$(".table tr").removeClass("click").children().removeClass("click");
			}
		});
    })()
    
})(jQuery); 

