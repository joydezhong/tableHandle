/**
 * 注释说明:
 * //此为函数说明 包括传参 作用
 * 
 * //$为插件扩展调用
 */
(function ($) {
    $.fn.extend({  
    	getrowcol: function(){  //获取table 行列数
			var obj;
			this.each(function(){
				var row_num = $(this).find("tr").length;  //行
				var col_num = $(this).find("td").length / (row_num - 1); //列
				obj = {rows: row_num, cols: col_num};
			});
			return obj;
		},
		
		addrow: function(table,arrcols,trlen,time){  //传 表格selector、编号列、tr长度、新增编号 参数 用于顺序插入
			return this.each(function(){
				var arr = [];
				$(arrcols).each(function(){
					arr.push($(this).text());
				});
				arr.push(time);
				arr.sort(function(x,y){
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
				var index = arr.indexOf(time);
				var _html;
				for(var i = 1;i < trlen; i++){  //tr的长度就是需要td的个数
					_html += "<td></td>";
				}
				table.find("tr").eq(index).after("<tr><td>"+time+"</td>"+_html+"</tr>");
			});
		},
		
		addcol: function(table,rownum,newdate){  //传参数： 表格selector、新列
			return this.each(function(){
				$("tr:first",this).append("<th>"+newdate+"</th>");
				$("tr:gt(0)",this).each(function(){
					$(this).append("<td></td>");
				});
			});
		}
		
    });  
})(jQuery); 

