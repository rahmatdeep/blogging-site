import { Avatar } from "./PostCard";

export default function Appbar() {
  return (
    <>
      <div className="border-b flex justify-between px-10 py-4 items-center">
        <div>Blogging App</div>
        <div>
          <Avatar name="Rahmatdeep" size={10} />
        </div>
      </div>
    </>
  );
}
