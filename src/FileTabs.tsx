import { Tab, Tabs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { MermaidFile } from './MermaidFile';

interface Props {
  activeFile: MermaidFile
  files: MermaidFile[]
  onCloseTab: (closeFile: MermaidFile) => void
  onNewTab: () => void
  onChangeTab: (fileId: string) => void
}

export const FileTabs: React.FC<Props> = ({ activeFile, files, onChangeTab, onCloseTab, onNewTab }) => {
  return (
    <Tabs
      value={activeFile.id}
      onChange={(_e, value) => onChangeTab(value)}
      sx={{ minHeight: 32, height: 32 }}
    >
      {
        files.map((f) => (
          <Tab sx={{ minHeight: 24, height: 24 }} value={f.id} icon={<ClearIcon onClick={() => { onCloseTab(f) }} />} iconPosition="end" label={`[${f.contentType()}] ${f.name}`} key={f.id} />
        ))
      }
      <Tab sx={{ minHeight: 24, height: 24 }} icon={<AddIcon />} onClick={onNewTab} />
    </Tabs>
  )
}
