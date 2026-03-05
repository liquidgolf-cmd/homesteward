export default function Placeholder({ title, message = 'Coming soon.' }) {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-heading text-2xl font-medium text-white">{title}</h1>
      <p className="mt-2 text-slate">{message}</p>
    </div>
  )
}
