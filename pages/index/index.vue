<template>
	<view class="container">
		<view class="chat-body">
			<scroll-view>
				<view class="list-item" v-for="(item) in chatList" :key="item.id" :id="`chatItem_${item.id}`">
					<chatItem  :mess="item" />
				</view>
			</scroll-view>
		</view>
		<view class="footer-operation">
			<!-- 输入操作 -->
			<view class="input-block">

				<textarea :confirm-hold="true" @linechange="linechange" :cursor-spacing="10" :cursor="10"
					:adjust-position="false" :disable-default-padding="true" :maxlength="-1" v-model="msgInput"
					placeholder="想问什么" :show-confirm-bar="false" :auto-height="false"
					:style="{height: inputHeight + 'rpx'}" @confirm="sendClick" confirm-type="send"
					@input="inputhandle" />

				<text class="send-btn" @click.stop.prevent="sendClick">发送</text>

			</view>
		</view>
	</view>
</template>

<script>
	import chatItem from '../components/chat-item.vue';
	export default {
		components: {chatItem},
		data() {
			return {
				msgInput: '',
				oldMsgInput: '',
				inputHeight: 54,
				lineHeight: 54,
				maxLine: 5,
				chatList: [{
					msg: '你好',
					is_me: 0,
					msg_type: 1

				}]
			}
		},
		methods: {
			inputhandle(e) {
				let {
					value,
					cursor,
					keyCode
				} = e.detail;
				let bool = this.msgInput.length > this.oldMsgInput.length;
				let last2Txt = this.msgInput[this.msgInput.length - 2];
				let flag = last2Txt !== ' ' && last2Txt != '\n' && last2Txt != '↵';
				if (/\n$/.test(value) && bool && flag) {
					this.msgInput = this.msgInput.slice(0, -1);
					this.sendClick();
				}
				this.oldMsgInput = this.msgInput;
			},
			sendClick() {
				console.log('发送消息', this.msgInput);
				if (!this.msgInput.trim()) {
					return this.$tips.warning('发送消息不能为空！');
				}
				let msgObj = {
					is_me: 1,
					msg: this.msgInput
				}
				this.chatList.push(msgObj);
				this.msgInput = '';
			},
			linechange(e) {
				console.log(e.detail, 'e.detail');
				let {
					height,
					heightRpx,
					lineCount
				} = e.detail;
				// console.log(height, 'height', heightRpx, 'heightRpx', lineCount, 'lineCount');
				// this.inputHeight = 50 * lineCount;
				if (this.maxLine > lineCount) {
					this.inputHeight = this.lineHeight * lineCount;
					// this.inputHeight = heightRpx;
				} else {
					this.inputHeight = this.lineHeight * this.maxLine;
				}
				// console.log(this.inputHeight, 'this.inputHeight');
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;

		.chat-body {
			flex: 1;
		}

	}

	.input-block {
		display: flex;
		padding: 18rpx 30rpx;
		align-items: flex-end;

		.input-icon {
			width: 56rpx;
			height: 56rpx;
			transform: translateY(-10rpx);
		}

		textarea,
		.textarea {
			flex: 1;
			min-height: 76rpx;
			line-height: 32rpx;
			// max-height: 150rpx;
			margin: 0rpx 20rpx;
			height: auto;
			background: #F6F7FC;
			// background: #999;
			border-radius: 12rpx;
			padding: 20rpx 20rpx;
			box-sizing: border-box;
			overflow-y: scroll;
			font-size: 32rpx;
			color: #1A1A1A;

			&::placeholder {
				color: #999999;
			}
		}

		input {
			position: absolute;
			top: -10rpx;
			left: 0;
			width: 750px;
			max-width: 750rpx;
			height: 200rpx;
			overflow: visible;
			word-break: break-all;
			z-index: 100;

		}

		.voice-input {
			flex: 1;
			margin: 0 20rpx;
			height: 76rpx;
			background: #F6F7FC;
			border-radius: 12rpx;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
			color: #1A1A1A;
			font-size: 32rpx;
			text-align: center;

			&.active {
				background: #b6b6b6;
				color: #fff;
			}
		}

		.more-icon {
			width: 56rpx;
			height: 56rpx;
			transform: translateY(-10rpx);
		}

		.send-btn {
			display: inline-block;
			width: 100rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: #FFB239;
			text-align: center;
			border-radius: 8rpx;
			font-size: 30rpx;
			color: #FFFFFF;
			font-weight: 700;
			transform: translateY(-6rpx);
		}
	}
</style>
