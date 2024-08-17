// From here: https://stackoverflow.com/a/20732091/1148118

export function HumanFileSize({ size }: { size: number }) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  const str = +(size / Math.pow(1024, i)).toFixed(2) * 1
  const unit = ["B", "kB", "MB", "GB", "TB"][i]
  return (
    <span className="human-file-size">
      {str} <span className="human-file-size-unit">{unit}</span>
    </span>
  )
}
