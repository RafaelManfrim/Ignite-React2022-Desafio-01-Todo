import styles from './TaskInformation.module.css'

interface TaskInformationProps {
  text: string;
  color?: 'blue' | 'purple';
  information: string
}

export function TaskInformation({ text, color = 'blue', information }: TaskInformationProps) {
  return (
    <div className={styles.taskInformation}>
      <strong className={color === 'blue' ? styles.textBlue : styles.textPurple}>
        {text}
      </strong>
      <span>{information}</span>
    </div>
  )
}
