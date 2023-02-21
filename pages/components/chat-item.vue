<!-- 聊天内容组件 -->
<template>
	<view class="chat-item" :id="`item-${mess.id}`" :class="{
      'me-chat': isMe,
    }">
		<view class="chat-time">
			{{ mess.date_time || "" }}
		</view>
		<!-- 带头像 -->
		<view class="chat-mess" :class="{ 'flex-c': msgType == 3 }">
			<image @click.stop="toUserPage(userInfo)" class="chat-avatar" :src="userInfo.avatar" mode=""></image>
			<view class="chat-content" v-if="msgType === 1">
				<text>{{ messContent }}</text>

			</view>

		</view>

	</view>
</template>

<script>
	export default {
		name: "chat-item",
		props: {
			mess: {
				type: Object,
				default: function() {
					return {};
				},
			},
		},
		data() {
			return {

			}
		},
		computed: {
			messContent() {
				let {
					mess
				} = this;
				return (mess && mess.message) || '';
			},
			userInfo() {
				let {
					mess
				} = this;
				return (mess && mess.from_user) || {};
			},
			isMe() {
				let {
					mess
				} = this;
				return (mess && mess.is_me) || "";
			},
			msgType() {
				let {
					mess
				} = this;
				return (mess && mess.msg_type) || 1;
			},
		}
	}
</script>

<style lang="less" scoped>
	.chat-item {
		position: relative;

		.chat-time {
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			padding: 16rpx 0;
		}

		.chat-mess {
			display: flex;
			padding: 20rpx 32rpx;
			position: relative;

			&.flex-c {
				align-items: center;
			}
		}

		.chat-avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 28rpx;
		}

		.chat-content {
			background-color: #ffffff;
			font-size: 30rpx;
			line-height: 50rpx;
			color: #333333;
			// flex: 1;
			max-width: 500rpx;
			padding: 16rpx;
			border-radius: 8rpx;
			box-sizing: border-box;
			position: relative;
			display: flex;
			align-items: center;
			word-break: break-all;
			word-wrap: break-word;
			white-space: pre-line;
			position: relative;

			navigator {
				max-width: 500rpx;
				word-break: break-all;
				word-wrap: break-word;
				white-space: pre-line;
			}

			&.chat-link {
				max-width: 500rpx;
			}

			.color {
				color: #e10b1f;
			}

			.bold {
				font-weight: bold;
			}

			.icon-call {
				width: 29rpx;
				height: 29rpx;
				margin-right: 10rpx;
			}

			&.good-content {
				.icon-good {
					width: 96rpx;
					height: 96rpx;
					margin-right: 16rpx;
				}

				text {
					flex: 1;
					font-weight: 700;
				}
			}

			.link-txt {
				color: blue;
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
			}

			&::after {
				content: "";
				display: inline-block;
				width: 12rpx;
				height: 16rpx;
				background: url(https://img-fe.ggwan.com/image/5cdfe99cb57c64-12x16.png) center/100% no-repeat;
				position: absolute;
				left: -12rpx;
				top: 32rpx;
			}

			.sys-txt {
				position: absolute;
				display: inline-block;
				text-align: center;
				line-height: 40rpx;
				width: 102rpx;
				height: 40rpx;
				background: #eaebef;
				border-radius: 8rpx;
				color: #999999;
				font-size: 22rpx;
				bottom: -44rpx;
				right: 0rpx;
			}
		}

		.chat-img {
			width: 334rpx;
			border-radius: 10rpx;
			vertical-align: top;

			image {
				width: 334rpx;
				border-radius: 10rpx;
				vertical-align: top;
			}
		}
	}

	.me-chat {
		.chat-avatar {
			margin-right: 0rpx;
			margin-left: 28rpx;
		}

		.chat-mess {
			flex-direction: row-reverse;
		}

		.chat-content {
			background-color: #ffe794;
			position: relative;

			&::after {
				content: "";
				display: inline-block;
				width: 12rpx;
				height: 16rpx;
				background: url(https://img-fe.ggwan.com/image/ced07918b1df2f-12x16.png) center/100% no-repeat;
				position: absolute;
				left: auto;
				right: -12rpx;
				top: 32rpx;
			}
		}
	}
</style>
