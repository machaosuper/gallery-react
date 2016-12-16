require('normalize.css/normalize.css');
// require('styles/App.css');
require('styles/mian.scss');


import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json')

//利用自执行函数，将图片名信息转换成URl信息
imageDatas = (function genImageUrl(imageDataArr) {
	for (var i = 0; i < imageDataArr.length; i++) {
		var singleImageData = imageDataArr[i];
		// console.log(singleImageData)
		singleImageData.imageUrl = require('../images/' + singleImageData.fileName);

		imageDataArr[i].imageUr = singleImageData.imageUrl;
	}
	return imageDataArr;
})(imageDatas)

/*
 *获取区间内的一个随机值
 */

function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low)
}
/*
 *获取0～30deg 之间的一个任意正负值
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));ßßß
}
// class ImgFigure extends React.Component {
//   render() {
//     return (
// 	    <figure>
// 	    	<img src={this.props.data.imageUrl}/>
// 	    	<figcaption>
// 	    		<h2>{this.props.data.title}</h2>
// 	    	</figcaption>
// 	    </figure>
//     );
//   }
// }

var ImgFigure = React.createClass({
	/*
	 *imgFigure的点击处理函数
	 */
	handleClick: function (e) {
		this.props.inverse()


		e.stopPropagation();
		e.preventDefault();
	},
  	render: function() {
	  	var styleObj = {}
	  	//如果props属性中指定了这张图片的位置信息，则使用
	  	if (this.props.arrange.pos) {
	  		styleObj = this.props.arrange.pos
	  	}
	  	//如果图片的旋转角度有值并且不为0，添加旋转角度
	  	if(this.props.arrange.rotate) {
	  		['MozTransform', 'msTransfrom', 'WebkitTransfrom', 'transform'].forEach(function (value) {
	  			styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)'
	  		}.bind(this))
	  		
	  	}
	  	debugger;
	  	var imgFigureClassName = "img-figure";
	  	imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''

	    return (
		    <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
		    	<img src={this.props.data.imageUrl}/>
		    	<figcaption>
		    		<h2 className="img-title">{this.props.data.title}</h2>
		    		<div className="img-back" onClick={this.handleClick}>
		    			<p>
		    				{this.props.data.desc}
		    			</p>
		    		</div>
		    	</figcaption>
		    </figure>
	    );
  	}

})

var GalleryByReactApp = React.createClass({


	Constant: {
		centerPos: {
			left: 0,
			top: 0
		},
		hPosRange: {	//水平方向的取值范围
			leftSecX: [0, 0],
			rightSecx: [0, 0],
			y: [0, 0]
		},
		vPosRange: {	//垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},

	/*
	 *反转图片
	 *@param index 输入当前被执行inverse操作的图片信息数组的index值
	 *return {function} 这是一个闭包函数，其内return 一个真正待被执行的函数
	 */
	inverse: function (index) {
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.state.imgsArrangeArr = imgsArrangeArr;
		}.bind(this)
	},
	getInitialState: function() {
		return {
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0 ,  //旋转角度
					isInverse: false //图片正反面
				}*/
			]
		}
	},
	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount: function() {
		//拿到舞台的大小
		// var stageDOM = React.findDOMNode(this.refs.stage),
		
		var stageDOM = this.refs.stage,
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//拿到imageFigure的大小
		// debugger;
		var imgFigureDOM = this.refs.imgFigure.children[0],
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			// imgW = 380,
			// imgH = 300,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		//计算中心位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		//计算左侧，右侧区域图片位置的取值范围
		this.Constant.hPosRange = {
			leftSecX: [ - halfImgW, halfStageW - halfImgW * 3],
			rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
			y: [ - halfImgH, stageH - halfImgH]
		}
		//计算上部区域图片位置的取值范围
		this.Constant.vPosRange = {
			x: [halfStageW - imgW, halfStageW],
			topY: [ - halfImgH, halfStageH - halfImgH * 3]
		}

		this.rearrange(0)
	},

	/*封装一个方法，布局所有的图片
	 *重新布局所有的图片
	 *@param centerIndex 指定居中那个图片
	 */
	rearrange: function (centerIndex) {
		// debugger;
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2), //取一个或者不取 
			topImgSpliceIndex = 0,


			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);


			//首先居中，centerIndex 的图片
			imgsArrangeCenterArr[0].pos = centerPos;


			//居中的图片，centerIndex 不需要旋转
			imgsArrangeCenterArr[0].rotate = 0;



			//取出要布局上侧的图片的状态信息
			// topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length)
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function (value, key) {
				imgsArrangeTopArr[key] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom()
				}
			})




			//布局左右两侧的图片
			for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				var hPosRangeLOPX = null;

				//前半部分布局左边,后半部分布局右面
				// debugger;
				if (i < k) {
					hPosRangeLOPX = hPosRangeLeftSecX;
				}else {
					hPosRangeLOPX = hPosRangeRightSecX;
				}
				// debugger;

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLOPX[0], hPosRangeLOPX[1])
					},
					rotate: get30DegRandom()
				}
			}


			if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})

	},

	render: function (){

		var constructorUnits = [],
			ImgFigures = [];
		
		//方法1
		imageDatas.forEach(function(value, key, arr) {
			if(!this.state.imgsArrangeArr[key]) {
				this.state.imgsArrangeArr[key] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false
				}
			}
			ImgFigures.push(<ImgFigure key={key} data={value} ref={'imgFigure' + key} arrange={this.state.imgsArrangeArr[key]} inverse={this.inverse(key)}/>);
		}.bind(this));
		
		//方法2
		// ImgFigures = imageDatas.map(function(value){
		// 	return <ImgFigure data={value} />
		// });

		//方法3
		// ImgFigures = imageDatas.map((value) => <ImgFigure data={value}/>);

		return (
			<section className="stage" ref="stage">
				<section className="img-sec" ref="imgFigure">
					{ImgFigures}
				</section>
				<nav className="constructor-nav">
					{constructorUnits}
				</nav>
			</section>
		);
	}


})



module.exports = GalleryByReactApp;

// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         <img src={yeomanImage} alt="Yeoman Generator" />
//         <span>Hello world </span>
//         <div className="notice">Please edit <code>src/components/Main.js</code> to get started!!!</div>
//       </div>
//     );
//   }
// }

// AppComponent.defaultProps = {
// };

// export default AppComponent;
