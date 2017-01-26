package com.google.appinventor.client.editor.youngandroid.events;

import com.google.gwt.core.client.JavaScriptObject;

public class CreateComponent extends JavaScriptObject implements DesignerEvent {
  public static final String TYPE;
  
  static {
    TYPE = init(CreateComponent.class);
  }

  protected CreateComponent() {}

  private static native String init(Class<CreateComponent> clazz)/*-{
    clazz.jsType = AppInventor.Events.CreateComponent;
    return clazz.jsType.prototype.type;
  }-*/;

  static native CreateComponent create(long projectId, String uuid, String componentType)/*-{
    return new AI.Events.CreateComponent();
  }-*/;

  @Override
  public native boolean recordUndo()/*-{
    return this.recordUndo;
  }-*/;

  @Override
  public native String getType()/*-{
    return this.type;
  }-*/;

  @Override
  public native <T> T as(Class<T> eventType)/*-{
    return eventType && eventType.jsType && eventType.jsType.prototype.type == this.type ?
      this : null;
  }-*/;

  @Override
  public native long getProjectId()/*-{
    return this.projectId;
  }-*/;

  @Override
  public native boolean isRealtime()/*-{
    return this.realtime;
  }-*/;

  @Override
  public native void setRealtime(boolean realtime)/*-{
    this.realtime = realtime;
  }-*/;

  @Override
  public long getUserId() {
    // TODO Auto-generated method stub
    return 0;
  }

}
