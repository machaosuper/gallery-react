require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/mian.scss');


import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json')

//利用自执行函数，将图片名信息转换成URl信息
imageDatas = (function genImageUrl(imageDataArr) {
	for (var i = 0; i < imageDataArr.length; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData.imageUrl;
	}
	return imageDataArr;
})(imageDatas)


var GalleryByReactApp = React.createClass({
	render: function (){
		return (
			<section className="stage">
				<section className="img-sec">

				</section>
				<nav className="constructor-nav">
					
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
