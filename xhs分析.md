```java
public final class MPresenterActions@C20380h2 extends Action<String> {

    /* renamed from: a */
    public final String f53186a;

    /* renamed from: b */
    public final int f53187b;

    /* renamed from: c */
    public final C16862m f53188c;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public MPresenterActions@C20380h2(String content, int i, C16862m c16862m) {
        super(content);
        Intrinsics.checkParameterIsNotNull(content, "content");
        this.f53186a = content;
        this.f53187b = i;
        this.f53188c = c16862m;
    }

    /* renamed from: a */
    public final C16862m m83600a() {
        return this.f53188c;
    }

    /* renamed from: b */
    public final String m83599b() {
        return this.f53186a;
    }

    /* renamed from: c */
    public final int m83598c() {
        return this.f53187b;
    }

    public /* synthetic */ MPresenterActions@C20380h2(String str, int i, ChatModel@C16862m c16862m, int i2, DefaultConstructorMarker defaultConstructorMarker) {
        this(str, i, (i2 & 4) != 0 ? null : c16862m);
    }
}
```

```java
/* 发送聊天消息 */
/* renamed from: u1 */
public void sendMessage@mo102124u1() {
    // 通过ID找到对应的 RichEditTextPro 控件
    RichEditTextPro chatInputContentView = (RichEditTextPro) _$_findCachedViewById(R$id.chatInputContentView);
    Intrinsics.checkExpressionValueIsNotNull(chatInputContentView, "chatInputContentView");

    // 检查输入框是否为空
    if (TextUtils.isEmpty(String.valueOf(chatInputContentView.getText()))) {
        return;
    }

    // 获取对应的 ChatPresenter 实例
    ChatPresenter chatPresenter = this.f34988a;
    if (chatPresenter == null) {
        Intrinsics.throwUninitializedPropertyAccessException("presenter");
    }

    // 再次获取输入框的内容，并将其传递给 ChatPresenter 的 mo23069a 方法
    RichEditTextPro chatInputContentView2 = (RichEditTextPro) _$_findCachedViewById(R$id.chatInputContentView);
    Intrinsics.checkExpressionValueIsNotNull(chatInputContentView2, "chatInputContentView");

    // 调用发送消息业务逻辑
    chatPresenter.dispatch@mo23069a(
        new C20380h2(
            String.valueOf(chatInputContentView2.getText())
            ,
            1,
            null,
            4,
            null
        )
    );

    // 清空输入框的内容
    ((RichEditTextPro) _$_findCachedViewById(R$id.chatInputContentView)).setText("");

    // 调用 ChatTrackUtils 类的静态方法，记录输入事件
    ChatTrackUtils.f32132a.m104402b("input");
}
```

```java
/* renamed from: l.f0.d2.c.a */
/* loaded from: classes8.dex */
public class Action<T> {
    public final T payload;

    public Action(T t) {
        this.payload = t;
    }

    public final T getPayload() {
        return this.payload;
    }
}
```

```java
public final MsgUIData messageToMsgUIData(Message msg) {
    ChatCommandBean chatCommandBean;
    Intrinsics.checkParameterIsNotNull(msg, "msg");
    try {
        MsgUIData msgUIData = new MsgUIData(null, null, 0, 0L, null, 0, null, null, null, null, 0, null, false, null, null, null, null, null, null, false, null, false, null, null, 0, 33554431, null);
        msgUIData.setMsgUUID(msg.getUuid());
        msgUIData.setMsgId(msg.getMsgId());
        msgUIData.setStoreId(msg.getStoreId());
        msgUIData.setCreatTime(msg.getCreateTime());
        msgUIData.setShowTime(MsgTimeUtils.f99311a.m27759a(msg.getCreateTime(), 2));
        msgUIData.setMsgType(msg.getContentType());
        msgUIData.setSenderId(msg.getSenderId());
        msgUIData.setReceiverId(msg.isGroupChat() ? msg.getGroupId() : msg.getReceiverId());
        msgUIData.setChatId(msg.getChatId());
        msgUIData.setLocalChatId(msg.getLocalChatUserId());
        msgUIData.setPushStatus(msg.getPushStatus());
        msgUIData.setHintMsg(msg.getMsg());
        msgUIData.setHasImpression(msg.getHasImpression());
        msgUIData.setHasPlayAnim(msg.getHasPlayAnim());
        msgUIData.setGroupChat(msg.isGroupChat());
        msgUIData.setGroupId(msg.getGroupId());
        msgUIData.setLocalGroupChatId(msg.getLocalGroupChatId());
        msgUIData.setVoiceState(msg.getVoiceState());
        msg.getCommand();
        try {
            chatCommandBean = (ChatCommandBean) new Gson().fromJson(msg.getCommand(), (Class<Object>) ChatCommandBean.class);
        } catch (Exception unused) {
            chatCommandBean = null;
        }
        msgUIData.setCommand(chatCommandBean);
        Object msgUiDataContent = INSTANCE.getMsgUiDataContent(msg.getContent());
        if (msgUiDataContent instanceof String) {
            msgUIData.setStrMsg((String) msgUiDataContent);
        } else if (msgUiDataContent instanceof MsgImageBean) {
            msgUIData.setImageMsg((MsgImageBean) msgUiDataContent);
        } else if (msgUiDataContent instanceof MsgMultiBean) {
            msgUIData.setMultimsg((MsgMultiBean) msgUiDataContent);
        } else if (msgUiDataContent instanceof MsgVoiceBean) {
            msgUIData.setVoiceMsg((MsgVoiceBean) msgUiDataContent);
        } else if (msgUiDataContent instanceof MsgRichHintBean) {
            msgUIData.setRichHintMsg((MsgRichHintBean) msgUiDataContent);
        } else if (msgUiDataContent instanceof MsgVideoBean) {
            msgUIData.setVideoMsg((MsgVideoBean) msgUiDataContent);
        }
        return msgUIData;
    } catch (Exception unused2) {
        return null;
    }
}
```

```java
public final ChatViewModel getChatModel@m83504H() {
    Lazy lazy = this.f53280h;
    KProperty kProperty = f53272B[1];
    return (ChatViewModel) lazy.getValue();
}
```

1. 调用发送消息业务逻辑

````java
chatPresenter.dispatch@mo23069a(
    new MPresenterActions@C20380h2(
        String.valueOf(chatInputContentView2.getText())
        ,
        1,
        null,
        4,
        null
    )
);
```

2. ChatPresenter:dispatch
```java
// mo23069a
if (action instanceof MPresenterActions@C20380h2) {
    MPresenterActions@C20380h2 _action = (MPresenterActions@C20380h2) action;
    sendMsg@m83456b(_action.m83599b(), _action.m83598c(), _action.m83600a());
}
````

3. send msg

```java
public final void sendMsg@m83456b(String str, int i, ChatModel@C16862m _chatModel) {
    String _content = ChatContentUtils.f53565a.m83151a(str);
    // 转换为Message类型
    com.xingin.chatbase.p453db.entity.Message _message = m83449c(_content, i, _chatModel);
    if (_message != null) {
        m83470a(_content, _message, _chatModel);
    }
}
```

4. 好像是显示到界面上

```java
public final void m83470a(String str, com.xingin.chatbase.p453db.entity.Message message, C16862m c16862m) {
    // 将消息转换为用于UI显示的数据结构
    MsgUIData messageToMsgUIData = MsgConvertUtils.INSTANCE.messageToMsgUIData(message);

    // 如果转换成功
    if (messageToMsgUIData != null) {
        // 使用消息管理器将消息数据传递给UI层
        m83504H().m101819a(messageToMsgUIData);

        // 根据消息的类型进行不同的处理
        if (message.getContentType() != 2 && message.getContentType() != 7) {
            if (message.getContentType() == 9) {
                // 处理类型为9的消息
                m83425l(messageToMsgUIData);
            } else if (message.getContentType() == 11) {
                // 处理类型为11的消息
                m83429j(messageToMsgUIData);
            } else {
                // 处理其他类型的消息
                m83474a(messageToMsgUIData, str, c16862m);
            }
        } else {
            // 处理类型为2或7的消息
            m83431i(messageToMsgUIData);
        }

        // MsgApmManager 是消息收发管理器???
        MsgApmManager _msgApmManager = MsgApmManager.f99217n.m27781a();
        if (_msgApmManager != null) {
            // android_chatPage_sendMsg_socketStart socket发送消息???
            _msgApmManager.m27802b(System.currentTimeMillis(), message.getUuid());
        }
    }
}
```


XHSLog
RomUtil
MsgSenderOfClient
AppMessagerClient
MsgApmManager
LonglinkLogViewManager

