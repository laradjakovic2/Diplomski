import { Button, Form, Row, UploadFile } from "antd";
import { useCallback, useState } from "react";
import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import "../../App.css";
import Upload, { RcFile } from "antd/es/upload";
import { EntityType, MediaType } from "../../models/Enums";
import { MediaRequestModel } from "../../models/media";
import { uploadMedia } from "../../api/mediaService";

interface Props {
  onClose: () => void;
  entityId: number;
}

function MediaForm({ onClose, entityId }: Props) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = useCallback(async () => {
    const command: MediaRequestModel = {
      relatedEntityId: entityId,
      entityType: EntityType.Competition,
      mediaType: MediaType.Image,
      file:
        fileList.length > 0
          ? {
              data: fileList[0].originFileObj,
              fileName: fileList[0].name,
            }
          : undefined,
    };

    uploadMedia(command);

    onClose();
  }, [entityId, fileList, onClose]);

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const uploadFile: UploadFile = {
      uid: file.uid,
      name: file.name,
      originFileObj: file,
    };
    setFileList([uploadFile]);
    return false;
  }, []);

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      onFinish={handleSubmit}
    >
      <Form.Item label={"Image"} name="file">
        <Upload
          onRemove={() => setFileList([])}
          beforeUpload={handleBeforeUpload}
          fileList={fileList}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Row className="form-buttons">
        <Button type="default" onClick={() => onClose()}>
          {"Cancel"}
        </Button>
        <Button type="primary" htmlType="submit">
          <SaveOutlined />
          {"Save"}
        </Button>
      </Row>
    </Form>
  );
}

export default MediaForm;
