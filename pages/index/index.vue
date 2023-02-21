<template>
	<view class="container" :style="{'height': `${windowHeight * 2}rpx`}">
		<!-- <div class="nav-bar" :style="{height: `${windowTop * 2}rpx` }"></div> -->
		<view class="chat-body">
			<scroll-view :scroll-top="scrollY" scroll-y="true" class="chat-scroll" :scroll-with-animation="scrollAnimation">
				<view class="list-item" v-for="(item) in chatList" :key="item.id" :id="`chatItem_${item.id}`">
					<chatItem :mess="item" />
				</view>
			</scroll-view>
		</view>
		<view class="footer-operation">
			<!-- 输入操作 -->
			<view class="input-block">

				<textarea :disabled="disabled" :confirm-hold="true" @linechange="linechange" :cursor-spacing="10" :cursor="10"
					:adjust-position="false" :disable-default-padding="true" :maxlength="-1" v-model="msgInput"
					placeholder="想问什么可以向我提问" :show-confirm-bar="false" :auto-height="false"
					:style="{height: inputHeight + 'rpx'}" @confirm="sendClick" confirm-type="send"
					@input="inputhandle" />

				<text class="send-btn" @click.stop.prevent="sendClick">发送</text>

			</view>
		</view>
	</view>
</template>

<script>
	import chatItem from '../components/chat-item.vue';
	import api from 'service/api';
	const ai_avatar = require('../../static/openai_avatar1.png');
	const me_avatar = require('../../static/openai_avatar2.png');
	export default {
		components: {chatItem},
		data() {
			return {
				conversationId: '',
				parentMessageId: '',
				disabled: false,
				scrollAnimation: true,
				OPENAI_API_KEY: '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',
				msgInput: '',
				scrollY: 9999,
				oldMsgInput: '',
				inputHeight: 54,
				lineHeight: 54,
				maxLine: 5,
				windowTop: 0,
				windowHeight: 667,
				helloMsg: {
					message: '我是ChatGPT，是一种基于自然语言处理技术的人工智能应用程序，由OpenAI公司开发和训练。我可以回答你的问题，帮助你解决问题和提供建议。',
					is_me: 0,
					msg_type: 1,
					from_user: {
						avatar: ai_avatar
					}
				},
				chatList: [],
				api: null,
			}
		},
		methods: {
		// 滚动到底部
		pageScrollToBottom() {
			console.log('--滚动--');
      this.$nextTick(() => {
				setTimeout(() => {
					this.scrollY += 100;
				}, 100);
			})
    },
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
			async sendClick() {
				console.log('发送消息', this.msgInput);
				if (!this.msgInput.trim()) {
					return this.$tips.warning('发送消息不能为空！');
				}
				// 提问
				this.createMsg({content: this.msgInput}, 1);
				// this.chatList.push(message);
				let message = this.msgInput;
				this.msgInput = '';
				let {conversationId, parentMessageId} = this;
				// this.disabled = true;
				let res = await api.sendMessage({message, conversationId, parentMessageId});
				// this.disabled = false;
				this.conversationId = res.conversationId;
				this.parentMessageId = res.messageId;
				console.log(res, 'res');
				// 回答
				this.createMsg(res, 0);
			},
			pushMsg(message) {
				this.chatList.push(message);
				uni.setStorageSync('chatList', this.chatList);
				this.pageScrollToBottom();
			},
	
			// type: ai: 0|me: 1
			createMsg(msgObj, type = 0) {
				let message = {
					...msgObj,
					is_me: type,
					msg_type: 1,
					message: msgObj.content || msgObj.response,
					from_user: {
						avatar: type ? me_avatar : ai_avatar
					}
				}
				this.pushMsg(message);
			},
			linechange(e) {
				console.log(e.detail, 'e.detail');
				let {
					height,
					heightRpx,
					lineCount
				} = e.detail;
				if (this.maxLine > lineCount) {
					this.inputHeight = this.lineHeight * lineCount;
				} else {
					this.inputHeight = this.lineHeight * this.maxLine;
				}
			},
			initChatList() {
				this.chatList = uni.getStorageSync('chatList') || [];
				if (!this.chatList.length) {
					this.chatList = [this.helloMsg];
				} else {
					this.pageScrollToBottom();
				}
			}
		},
		onLoad() {
			this.initChatList();
			let windowInfo = uni.getWindowInfo();
			console.log(windowInfo, 'windowInfo');
			this.windowTop = windowInfo.windowTop || 0;
			this.windowHeight = windowInfo.windowHeight;
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
		background-color: #f6f7fc;
		.chat-body {
			flex: 1;
			overflow-y: scroll;
			display: flex;
			flex-direction: column;
		}

	}

	.input-block {
		display: flex;
		padding: 18rpx 30rpx;
		align-items: flex-end;
		background-color: #fff;

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
			overflow-y:hidden;

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
	.chat-scroll {
		width: 100%;
		overflow-y: scroll;
		flex: 1;
		overflow-anchor: auto;
		padding-bottom: 10rpx;
	}
.chat-list {
  width: 100%;
  padding-bottom: 60rpx;
  overflow-anchor: auto;
}
</style>
